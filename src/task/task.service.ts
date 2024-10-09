import { Injectable } from '@nestjs/common';
import {
  InventoryItem,
  TaskItems,
  TaskRequest,
  SaleItems,
  SaleRequest,
} from './task.entity';
import { In, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectItem } from 'src/organization/organization.entity';
import { TaskWorkLog } from 'src/site/site.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRequest)
    private readonly TaskRequestRepository: Repository<TaskRequest>,
    @InjectRepository(TaskItems)
    private readonly TaskItemsRepository: Repository<TaskItems>,
    @InjectRepository(SaleRequest)
    private readonly SaleRequestRepository: Repository<SaleRequest>,
    @InjectRepository(SaleItems)
    private readonly SaleItemsRepository: Repository<SaleItems>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(ProjectItem)
    private readonly ProjectItemRepository: Repository<ProjectItem>,
    @InjectRepository(TaskWorkLog)
    private readonly taskWorkLogRepository: Repository<TaskWorkLog>,
  ) {}

  async createTaskRequest(itemDetails: {
    details: TaskRequest;
    products: TaskItems[];
  }): Promise<TaskRequest> {
    const maxTaskNo = await this.TaskRequestRepository.createQueryBuilder('sr')
      .select('MAX(sr.task_no)', 'maxTaskNo')
      .where('sr.client_id = :clientId', {
        clientId: itemDetails.details['client_id'],
      })
      .getRawOne();
    const nextTaskNo = maxTaskNo.maxTaskNo + 1;
    const task = await this.TaskRequestRepository.create({
      ...itemDetails.details,
      task_no: maxTaskNo && maxTaskNo.maxTaskNo ? nextTaskNo : 1,
    });
    const resp = await this.TaskRequestRepository.save(task);
    return resp;
  }

  async updateTaskRequest(itemDetails: TaskRequest): Promise<boolean> {
    // Update the task request details in the TaskRequestRepository
    await this.TaskRequestRepository.update(itemDetails.id, itemDetails);

    // Return true indicating the update was successful
    return true;
  }

  async createSaleRequest(itemDetails: {
    details: SaleRequest;
    products: SaleItems[];
  }): Promise<SaleRequest> {
    let saleRequest = itemDetails.details;
    if (itemDetails.details.id) {
      delete itemDetails.details['items'];
      delete itemDetails.details['new_customer'];
      this.SaleItemsRepository.delete({ sale: saleRequest });
      await this.SaleRequestRepository.update(itemDetails.details.id, {
        ...itemDetails.details,
      });
    } else {
      const maxSaleNo = await this.SaleRequestRepository.createQueryBuilder(
        'sr',
      )
        .select('MAX(sr.sale_no)', 'sale_no')
        .where('sr.client_id = :clientId', {
          clientId:
            itemDetails.details['client'] || itemDetails.details['client_id'],
        })
        .getRawOne();
      const nextSaleNo = maxSaleNo.sale_no + 1;
      const sale = await this.SaleRequestRepository.create({
        ...itemDetails.details,
        sale_no: maxSaleNo && maxSaleNo.sale_no ? nextSaleNo : 1,
      });
      saleRequest = await this.SaleRequestRepository.save(sale);
    }

    itemDetails.products = itemDetails.products.map((item) => ({
      ...item,
      sale: saleRequest,
    }));

    this.SaleItemsRepository.save(itemDetails.products);
    return saleRequest;
  }

  async updateSaleRequest(itemDetails: {
    details: SaleRequest;
    products: SaleItems[];
  }): Promise<boolean> {
    try {
      // Update the sale request details in the SaleRequestRepository
      const existingItem = await this.SaleRequestRepository.findOneBy({
        id: itemDetails.details.id,
      });
      await this.SaleRequestRepository.update(
        itemDetails.details.id,
        itemDetails.details,
      );

      // Update each Sale item in the SaleItemsRepository
      for (const product of itemDetails.products) {
        await this.SaleItemsRepository.update(product.id, product);
      }
      if (
        existingItem.state !== itemDetails.details.state &&
        itemDetails.details.state == 4
      ) {
        const so = await this.SaleRequestRepository.findOne({
          where: {
            id: itemDetails.details.id,
          },
          relations: ['created_by', 'organization', 'client'],
        });
        const products = await this.SaleItemsRepository.find({
          where: { id: In(itemDetails.products.map((pr) => pr.id)) },
          relations: ['project'],
        });
        for (const product of products) {
          if (!product.isCustom) {
            const inventory = {
              organization_id: so.organization.id,
              client_id: so.client.id,
              sale_id: so.id,
              sale_no: so.sale_no,
              stock_in: false,
              name: product.name,
              project: product.project,
              qty:
                product.qty -
                product.return_details.reduce(
                  (total, obj) => total + obj.qty * 1,
                  0,
                ),
              unit_price: product.unit_price,
              description: so.title,
              total:
                product.total - this.sumReturnAmount(product.return_details),
              date_created: new Date(),
            };
            const inventoryItem =
              this.inventoryItemRepository.create(inventory);
            await this.inventoryItemRepository.save(inventoryItem);
          }
        }
      }
      if (!itemDetails.details.state) {
        const products = await this.SaleItemsRepository.find({
          where: { id: In(itemDetails.products.map((pr) => pr.id)) },
          relations: ['project'],
        });
        products.forEach(async (product) => {
          // Initialize total returned quantity
          let totalReturnedQty = 0;

          // Sum up the quantities of returned items
          product.return_details.forEach((returnItem) => {
            totalReturnedQty += Number(returnItem.qty);
          });
          if (product.name) {
            // Calculate remaining quantity
            const remainingQty = product.qty - totalReturnedQty;

            await this.inventoryItemRepository.update(
              {
                sale_id: itemDetails.details.id,
                name: product.name,
              },
              {
                qty: remainingQty,
              },
            );
          }
        });
      }

      // Return true indicating the update was successful
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  sumReturnAmount(return_details: any[]): number {
    let totalReturnAmount = 0;

    (return_details as any[]).forEach((returnDetail) => {
      totalReturnAmount += returnDetail.returnAmount;
    });

    return totalReturnAmount;
  }

  async getTaskRequestsByState(
    organizationId: number,
    clientId: number,
    state: number,
  ): Promise<any[]> {
    const query = `
      SELECT * FROM get_task_requests($1, $2, $3)
    `;
    return await this.TaskRequestRepository.query(query, [
      state,
      organizationId,
      clientId,
    ]);
  }

  async getTaskRequests(
    organizationId: number,
    clientId: number,
    state: string[] = [],
  ): Promise<any[]> {
    const query = this.TaskRequestRepository.createQueryBuilder('pr')
      .select('pr.id', 'id')
      .addSelect('pr.state', 'state')
      .addSelect('pr.task_no', 'task_no')
      .addSelect('pr.type', 'type')
      .addSelect('pr.organization_id', 'organization_id')
      .addSelect('pr.client_id', 'client_id')
      .addSelect('pr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('u2.name', 'assignee_name')
      .addSelect('so.name', 'client_name')
      .addSelect('pr.date_created', 'date_created')
      .addSelect('pr.description', 'description')
      .addSelect('pr.title', 'title')
      .addSelect('pr.due_date', 'due_date')
      .addSelect('pr.start_date', 'start_date')
      .addSelect('pr.severity', 'severity')
      .addSelect('pr.assignee', 'assignee')
      .addSelect('pr.terms', 'terms')
      .leftJoin('user', 'u', 'pr.created_by = u.id')
      .leftJoin('client', 'so', 'pr.client_id = so.id')
      .leftJoin('user', 'u2', 'pr.assignee = u2.id')
      .where('pr.organization_id = :organizationId', { organizationId })
      .andWhere('pr.client_id = :clientId', {
        clientId,
      })
      .orderBy({ date_created: 'DESC' });
    if (state.length > 1) {
      query.andWhere('pr.state IN (:...state)', { state });
    } else if (state.length > 0) {
      query.andWhere('pr.state = :state', { state });
    }
    return await query.getRawMany();
  }

  async getSalesRequestsByCustomer(
    organizationId: number,
    clientId: number,
    customer: number,
  ): Promise<any[]> {
    const query = this.SaleRequestRepository.createQueryBuilder('sr')
      .select('sr.id', 'id')
      .addSelect('sr.state', 'state')
      .addSelect('sr.sale_no', 'sale_no')
      .addSelect('sr.organization_id', 'organization_id')
      .addSelect('sr.client_id', 'client_id')
      .addSelect('sr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('so.name', 'client_name')
      .addSelect('sr.date_created', 'date_created')
      .addSelect('sr.total', 'total')
      .addSelect('sr.description', 'description')
      .addSelect('sr.additional_cost', 'additional_cost')
      .addSelect('sr.balance_to_be_paid_on', 'balance_to_be_paid_on')
      .addSelect('sr.date_confirmation_on', 'date_confirmation_on')
      .addSelect('sr.item_cost', 'item_cost')
      .addSelect('sr.shipment_charges', 'shipment_charges')
      .addSelect('sr.amount_paid', 'amount_paid')
      .addSelect('sr.balance', 'balance')
      .addSelect('sr.title', 'title')
      .addSelect('sr.items_discount_total', 'items_discount_total')
      .addSelect('sr.overall_discount_total', 'overall_discount_total')
      .addSelect('sr.overall_discount', 'overall_discount')
      .addSelect('sr.invoice_date', 'invoice_date')
      .addSelect('sr.due_date', 'due_date')
      .addSelect('c.name', 'customer_name')
      .addSelect('sr.terms', 'terms')
      .leftJoin('user', 'u', 'sr.created_by = u.id')
      .leftJoin('customer', 'c', 'sr.customer_id = c.id')
      .leftJoin('client', 'so', 'sr.client_id = so.id')
      .where('sr.organization_id = :organizationId', { organizationId })
      .andWhere('sr.client_id = :clientId', {
        clientId,
      })
      .andWhere('sr.customer_id = :customer', {
        customer,
      })
      .orderBy({ date_created: 'DESC' });
    // console.log(query)
    return query.getRawMany();
    // return await this.TaskRequestRepository.query(query, [organizationId, clientId]);
  }

  async getSalesRequests(
    organizationId: number,
    clientId: number,
    state: string[] = [],
  ): Promise<any[]> {
    const query = this.SaleRequestRepository.createQueryBuilder('sr')
      .select('sr.id', 'id')
      .addSelect('sr.state', 'state')
      .addSelect('sr.sale_no', 'sale_no')
      .addSelect('sr.organization_id', 'organization_id')
      .addSelect('sr.client_id', 'client_id')
      .addSelect('sr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('so.name', 'client_name')
      .addSelect('sr.date_created', 'date_created')
      .addSelect('sr.total', 'total')
      .addSelect('sr.description', 'description')
      .addSelect('sr.additional_cost', 'additional_cost')
      .addSelect('sr.balance_to_be_paid_on', 'balance_to_be_paid_on')
      .addSelect('sr.date_confirmation_on', 'date_confirmation_on')
      .addSelect('sr.item_cost', 'item_cost')
      .addSelect('sr.shipment_charges', 'shipment_charges')
      .addSelect('sr.amount_paid', 'amount_paid')
      .addSelect('sr.balance', 'balance')
      .addSelect('sr.title', 'title')
      .addSelect('sr.items_discount_total', 'items_discount_total')
      .addSelect('sr.overall_discount_total', 'overall_discount_total')
      .addSelect('sr.overall_discount', 'overall_discount')
      .addSelect('sr.invoice_date', 'invoice_date')
      .addSelect('sr.due_date', 'due_date')
      .addSelect('c.name', 'customer_name')
      .addSelect('sr.terms', 'terms')
      .leftJoin('user', 'u', 'sr.created_by = u.id')
      .leftJoin('customer', 'c', 'sr.customer_id = c.id')
      .leftJoin('client', 'so', 'sr.client_id = so.id')
      .where('sr.organization_id = :organizationId', { organizationId })
      .andWhere('sr.client_id = :clientId', {
        clientId,
      })
      .orderBy({ date_created: 'DESC' });
    if (Array.isArray(state) && state.length) {
      query.andWhere('sr.state IN (:...state)', { state });
    } else if (!Array.isArray(state) && state) {
      query.andWhere('sr.state = :state', { state });
    }
    // console.log(query)
    return query.getRawMany();
    // return await this.TaskRequestRepository.query(query, [organizationId, clientId]);
  }

  async getTaskRequest(
    organizationId: number,
    clientId: number,
    taskId: number,
  ): Promise<any> {
    const result = await this.TaskRequestRepository.createQueryBuilder('pr')
      .leftJoinAndSelect('pr.created_by', 'u')
      .leftJoinAndSelect('pr.client', 'so')
      .select([
        'pr.id',
        'pr.state',
        'pr.task_no',
        'pr.type',
        'pr.organization_id',
        'pr.client_id',
        'pr.created_by',
        'u.name',
        'u.id',
        'so.name',
        'pr.date_created',
        'pr.description',
        'pr.title',
        'pr.due_date',
        'pr.start_date',
        'pr.severity',
        'pr.assignee',
        'pr.attachment',
        'pr.terms',
      ])
      .where('pr.task_no = :taskId', { taskId })
      .andWhere('pr.organization_id = :organizationId', { organizationId })
      .andWhere('pr.client_id = :clientId', {
        clientId,
      })
      .getOne();

    if (result && result.id) {
      const items = await this.TaskItemsRepository.findBy({
        task: { id: result.id },
      });

      result['items'] = items;
    }
    return result;
  }

  async getSaleRequests(
    organizationId: number,
    clientId: number,
  ): Promise<any[]> {
    const query = `
      SELECT * FROM get_all_task_requests($1, $2)
    `;
    return await this.TaskRequestRepository.query(query, [
      organizationId,
      clientId,
    ]);
  }

  async getSaleRequest(
    organizationId: number,
    clientId: number,
    saleId: number,
  ): Promise<any> {
    const result = await this.SaleRequestRepository.createQueryBuilder('sr')
      .leftJoinAndSelect('sr.created_by', 'u')
      .leftJoinAndSelect('sr.client', 'so')
      .leftJoinAndSelect('sr.customer', 'c')
      .select([
        'sr.id',
        'sr.state',
        'sr.organization_id',
        'sr.client_id',
        'sr.created_by',
        'sr.sale_no',
        'c.name',
        'c',
        'u.name',
        'u.id',
        'so.name',
        'sr.date_created',
        'sr.total',
        'sr.description',
        'sr.additional_cost',
        'sr.balance_to_be_paid_on',
        'sr.date_confirmation_on',
        'sr.item_cost',
        'sr.shipment_charges',
        'sr.amount_paid',
        'sr.balance',
        'sr.payment_history',
        'sr.title',
        'sr.items_discount_total',
        'sr.overall_discount_total',
        'sr.overall_discount',
        'sr.invoice_date',
        'sr.due_date',
        'sr.attachment',
        'sr.terms',
      ])
      .where('sr.sale_no = :saleId', { saleId })
      .andWhere('sr.organization_id = :organizationId', { organizationId })
      .andWhere('sr.client_id = :clientId', {
        clientId,
      })
      .getOne();

    if (result && result.id) {
      const items = await this.SaleItemsRepository.findBy({
        sale: { id: result.id },
      });

      result['items'] = items;
    }
    return result;
  }

  async createInventoryItem(
    data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    const inventoryItem = this.inventoryItemRepository.create(data);
    return await this.inventoryItemRepository.save(inventoryItem);
  }

  async getInventory(organizationId: number, clientId: number): Promise<any[]> {
    const inventoryItems: any = await this.inventoryItemRepository.find({
      where: {
        organization_id: organizationId,
        client_id: clientId,
      },
      relations: ['project'], // Assuming you have relations defined in your entity
    });

    // Group by item name and project name
    const groupedData = inventoryItems.reduce((acc, item) => {
      const key = `${item.name}-${item.project.name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const result = Object.keys(groupedData).map((key) => {
      const items = groupedData[key];

      // Filter items where stock_in is true
      const stockInItems = items.filter((item) => item.stock_in);

      // Get the latest unit price where stock_in is true
      const latestStockInItem = stockInItems.reduce((latest, item) => {
        return new Date(item.date_created) > new Date(latest.date_created)
          ? item
          : latest;
      }, stockInItems[0]);

      // Calculate the total quantity sold
      const totalQuantitySold = items
        .filter((item) => !item.stock_in)
        .reduce((acc, item) => acc + item.qty, 0);

      // Apply FIFO rule to calculate the total value and quantity of remaining items
      const remainingItems = [...stockInItems];
      let remainingQtyToRemove = totalQuantitySold;
      while (remainingQtyToRemove > 0 && remainingItems.length > 0) {
        const currentItem = remainingItems[0];
        if (currentItem.qty > remainingQtyToRemove) {
          currentItem.qty -= remainingQtyToRemove;
          remainingQtyToRemove = 0;
        } else {
          remainingQtyToRemove -= currentItem.qty;
          remainingItems.shift(); // Remove the item completely
        }
      }

      // Calculate the average unit price of remaining items
      const totalRemainingValue = remainingItems.reduce((acc, item) => {
        return acc + item.qty * parseFloat(item.unit_price);
      }, 0);
      const totalRemainingQty = remainingItems.reduce(
        (acc, item) => acc + item.qty,
        0,
      );
      const averageUnitPrice =
        totalRemainingQty > 0
          ? (totalRemainingValue / totalRemainingQty).toFixed(2)
          : '0.00';

      return {
        ...items[0],
        item_name: items[0].name,
        project_name: items[0].project.name,
        latest_unit_price: latestStockInItem.unit_price,
        qty: totalRemainingQty,
        avg_unit_price: averageUnitPrice,
      };
    });

    return result;
  }

  async getProjectStats(
    organizationId: number,
    clientId: number,
  ): Promise<any> {
    const worklogs = await this.getWorkLogs(organizationId, clientId);
    const tasks = await this.getTaskRequests(organizationId, clientId);
    return {
      worklogs,
      tasks,
    };
  }

  private calculateAvailableUnitPrice(item: InventoryItem): number {
    // Implement your logic here to calculate available unit price
    // Example logic (modify based on your actual requirements):
    const totalStockValue = item.qty * item.unit_price;
    const totalStockQty = item.qty;

    if (totalStockQty > 0) {
      return totalStockValue / totalStockQty;
    } else {
      return 0;
    }
  }

  async getInventoryItemDetails(
    organization_id: number,
    client_id: number,
    name: string,
  ): Promise<InventoryItem[]> {
    return name
      ? this.inventoryItemRepository.findBy({
          organization_id,
          client_id,
          name,
        })
      : this.inventoryItemRepository.findBy({
          organization_id,
          client_id,
        });
  }

  async getInventoryBySite(
    organization_id: number,
    client_id: number,
    siteId: number,
  ): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.findBy({
      organization_id,
      client_id,
      site_ids: Raw((alias) => `CAST(${alias} AS text) ILIKE '%${siteId}%'`),
    });
  }

  async getTaskWorkLogs(
    organization_id: number,
    client_id: number,
    task_id: number,
  ) {
    const siteOwnerPayments = await this.taskWorkLogRepository
      .createQueryBuilder('taskWorkLog')
      .leftJoinAndSelect('taskWorkLog.created_by', 'user') // Join the 'created_by' user
      .select([
        'taskWorkLog.id', // Select fields from TaskWorkLog
        'taskWorkLog.work_from',
        'taskWorkLog.no_of_hours',
        'taskWorkLog.date_created',
        'taskWorkLog.note',
        'taskWorkLog.paid',
        'user.id', // Select specific properties from User
        'user.name', // Example: selecting 'name' from User
      ])
      .where('taskWorkLog.task = :taskId', { taskId: task_id })
      .andWhere('taskWorkLog.organization = :organizationId', {
        organizationId: organization_id,
      })
      .andWhere('taskWorkLog.client = :clientId', { clientId: client_id })
      .orderBy('taskWorkLog.id', 'ASC')
      .getMany();
    return siteOwnerPayments;
  }

  async getWorkLogs(organization_id: number, client_id: number) {
    const siteOwnerPayments = await this.taskWorkLogRepository
      .createQueryBuilder('taskWorkLog')
      .leftJoinAndSelect('taskWorkLog.created_by', 'user') // Join the 'created_by' user
      .select([
        'taskWorkLog.id', // Select fields from TaskWorkLog
        'taskWorkLog.work_from',
        'taskWorkLog.no_of_hours',
        'taskWorkLog.date_created',
        'taskWorkLog.paid',
        'taskWorkLog.note',
        'user.id', // Select specific properties from User
        'user.name', // Example: selecting 'name' from User
      ])
      .where('taskWorkLog.client = :clientId', { clientId: client_id })
      .andWhere('taskWorkLog.organization = :organizationId', {
        organizationId: organization_id,
      })
      .orderBy('taskWorkLog.id', 'ASC')
      .getMany();
    return siteOwnerPayments;
  }
  async createTaskWorkLog(details: TaskWorkLog) {
    const worklog = this.taskWorkLogRepository.create(details);
    const resp = await this.taskWorkLogRepository.save(worklog);
    return resp;
  }
}
