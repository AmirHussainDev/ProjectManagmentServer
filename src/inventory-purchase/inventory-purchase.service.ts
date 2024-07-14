import { Injectable } from '@nestjs/common';
import {
  InventoryItem,
  PurchaseItems,
  PurchaseRequest,
  SaleItems,
  SaleRequest,
} from './inventory-purchase.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InventoryPurchaseService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly PurchaseRequestRepository: Repository<PurchaseRequest>,
    @InjectRepository(PurchaseItems)
    private readonly PurchaseItemsRepository: Repository<PurchaseItems>,
    @InjectRepository(SaleRequest)
    private readonly SaleRequestRepository: Repository<SaleRequest>,
    @InjectRepository(SaleItems)
    private readonly SaleItemsRepository: Repository<SaleItems>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async createPurchaseRequest(itemDetails: {
    details: PurchaseRequest;
    products: PurchaseItems[];
  }): Promise<PurchaseRequest> {
    const maxPurchaseNo =
      await this.PurchaseRequestRepository.createQueryBuilder('sr')
        .select('MAX(sr.purchase_no)', 'maxPurchaseNo')
        .where('sr.sub_organization_id = :subOrganizationId', {
          subOrganizationId: itemDetails.details['sub_organization_id'],
        })
        .getRawOne();
    const nextPurchaseNo = maxPurchaseNo.maxPurchaseNo + 1;
    const purchase = await this.PurchaseRequestRepository.create({
      ...itemDetails.details,
      purchase_no:
        maxPurchaseNo && maxPurchaseNo.maxPurchaseNo ? nextPurchaseNo : 1,
    });
    const resp = await this.PurchaseRequestRepository.save(purchase);
    itemDetails.products = itemDetails.products.map((item) => ({
      ...item,
      purchase: resp,
    }));
    this.PurchaseItemsRepository.save(itemDetails.products);
    return resp;
  }

  async updatePurchaseRequest(itemDetails: {
    details: PurchaseRequest;
    products: PurchaseItems[];
  }): Promise<boolean> {
    // Update the purchase request details in the PurchaseRequestRepository
    await this.PurchaseRequestRepository.update(
      itemDetails.details.id,
      itemDetails.details,
    );

    // Update each purchase item in the PurchaseItemsRepository
    for (const product of itemDetails.products) {
      await this.PurchaseItemsRepository.update(product.id, product);
    }

    if (itemDetails.details.state == 4) {
      const po = await this.PurchaseRequestRepository.findOne({
        where: {
          id: itemDetails.details.id,
        },
        relations: ['created_by', 'organization', 'subOrganization', 'vendor'],
      });
      const products = await this.PurchaseItemsRepository.find({
        where: {
          purchase: { id: po.id },
        },
      });
      for (const product of products) {
        if (!product.isCustom) {
          const inventory = {
            organization_id: po.organization.id,
            sub_organization_id: po.subOrganization.id,
            purchase_id: po.id,
            purchase_no: po.purchase_no,
            stock_in: true,
            name: product.name,
            vendor_id: po.vendor.id,
            isSiteBased: po.isSiteBased,
            site_ids: po.site_ids,
            qty: product.qty,
            unit_price: product.unit_price,
            description: po.subject,
            total: product.total,
            date_created: new Date(),
          };
          const inventoryItem = this.inventoryItemRepository.create(inventory);
          await this.inventoryItemRepository.save(inventoryItem);
        }
      }
    }
    // Return true indicating the update was successful
    return true;
  }

  async createSaleRequest(itemDetails: {
    details: SaleRequest;
    products: SaleItems[];
  }): Promise<SaleRequest> {
    const maxSaleNo = await this.SaleRequestRepository.createQueryBuilder('sr')
      .select('MAX(sr.sale_no)', 'sale_no')
      .where('sr.sub_organization_id = :subOrganizationId', {
        subOrganizationId: itemDetails.details['sub_organization_id'],
      })
      .getRawOne();
    const nextSaleNo = maxSaleNo.sale_no + 1;
    const sale = await this.SaleRequestRepository.create({
      ...itemDetails.details,
      sale_no: maxSaleNo && maxSaleNo.sale_no ? nextSaleNo : 1,
    });
    const resp = await this.SaleRequestRepository.save(sale);
    itemDetails.products = itemDetails.products.map((item) => ({
      ...item,
      sale: resp,
    }));
    this.SaleItemsRepository.save(itemDetails.products);
    return resp;
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
          relations: ['created_by', 'organization', 'subOrganization'],
        });
        const products = await this.SaleItemsRepository.findByIds(
          itemDetails.products.map((pr) => pr.id),
        );
        for (const product of products) {
          if (!product.isCustom) {
            const inventory = {
              organization_id: so.organization.id,
              sub_organization_id: so.subOrganization.id,
              sale_id: so.id,
              sale_no: so.sale_no,
              stock_in: false,
              name: product.name,
              vendor_id: product.vendor_id,
              qty:
                product.qty -
                product.return_details.reduce(
                  (total, obj) => total + obj.qty * 1,
                  0,
                ),
              unit_price: product.unit_price,
              description: so.subject,
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
        itemDetails.products.forEach((product) => {
          // Initialize total returned quantity
          let totalReturnedQty = 0;

          // Sum up the quantities of returned items
          product.return_details.forEach((returnItem) => {
            totalReturnedQty += returnItem.qty;
          });
          if (product.name) {
            // Calculate remaining quantity
            const remainingQty = product.qty - totalReturnedQty;

            this.inventoryItemRepository.update(
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

  async getPurchaseRequestsByState(
    organizationId: number,
    subOrganizationId: number,
    state: number,
  ): Promise<any[]> {
    const query = `
      SELECT * FROM get_purchase_requests($1, $2, $3)
    `;
    return await this.PurchaseRequestRepository.query(query, [
      state,
      organizationId,
      subOrganizationId,
    ]);
  }

  async getPurchaseRequests(
    organizationId: number,
    subOrganizationId: number,
  ): Promise<any[]> {
    const query = this.PurchaseRequestRepository.createQueryBuilder('pr')
      .select('pr.id', 'id')
      .addSelect('pr.state', 'state')
      .addSelect('pr.purchase_no', 'purchase_no')
      .addSelect('pr.organization_id', 'organization_id')
      .addSelect('pr.sub_organization_id', 'sub_organization_id')
      .addSelect('pr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('so.name', 'sub_organization_name')
      .addSelect('pr.date_created', 'date_created')
      .addSelect('pr.total', 'total')
      .addSelect('pr.notes', 'notes')
      .addSelect('pr.additional_cost', 'additional_cost')
      .addSelect('pr.balance_to_be_paid_on', 'balance_to_be_paid_on')
      .addSelect('pr.date_confirmation_on', 'date_confirmation_on')
      .addSelect('pr.item_cost', 'item_cost')
      .addSelect('pr.shipment_charges', 'shipment_charges')
      .addSelect('pr.amount_paid', 'amount_paid')
      .addSelect('pr.balance', 'balance')
      .addSelect('v.filename', 'filename')
      .addSelect('v.name', 'vendor_name')
      .addSelect('pr.subject', 'subject')
      .addSelect('pr.items_discount_total', 'items_discount_total')
      .addSelect('pr.overall_discount_total', 'overall_discount_total')
      .addSelect('pr.overall_discount', 'overall_discount')
      .addSelect('pr.invoice_date', 'invoice_date')
      .addSelect('pr.due_date', 'due_date')
      .addSelect('pr.sales_person', 'sales_person')
      .addSelect('pr.terms', 'terms')
      .leftJoin('user', 'u', 'pr.created_by = u.id')
      .leftJoin('vendor', 'v', 'pr.vendor_id = v.id')
      .leftJoin('sub_organization', 'so', 'pr.sub_organization_id = so.id')
      .where('pr.organization_id = :organizationId', { organizationId })
      .andWhere('pr.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .orderBy({ date_created: 'DESC' });
    return await query.getRawMany();
  }

  async getSalesRequestsByCustomer(
    organizationId: number,
    subOrganizationId: number,
    customer: number,
  ): Promise<any[]> {
    const query = this.SaleRequestRepository.createQueryBuilder('sr')
      .select('sr.id', 'id')
      .addSelect('sr.state', 'state')
      .addSelect('sr.sale_no', 'sale_no')
      .addSelect('sr.organization_id', 'organization_id')
      .addSelect('sr.sub_organization_id', 'sub_organization_id')
      .addSelect('sr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('so.name', 'sub_organization_name')
      .addSelect('sr.date_created', 'date_created')
      .addSelect('sr.total', 'total')
      .addSelect('sr.notes', 'notes')
      .addSelect('sr.additional_cost', 'additional_cost')
      .addSelect('sr.balance_to_be_paid_on', 'balance_to_be_paid_on')
      .addSelect('sr.date_confirmation_on', 'date_confirmation_on')
      .addSelect('sr.item_cost', 'item_cost')
      .addSelect('sr.shipment_charges', 'shipment_charges')
      .addSelect('sr.amount_paid', 'amount_paid')
      .addSelect('sr.balance', 'balance')
      .addSelect('sr.subject', 'subject')
      .addSelect('sr.items_discount_total', 'items_discount_total')
      .addSelect('sr.overall_discount_total', 'overall_discount_total')
      .addSelect('sr.overall_discount', 'overall_discount')
      .addSelect('sr.invoice_date', 'invoice_date')
      .addSelect('sr.due_date', 'due_date')
      .addSelect('c.name', 'customer_name')
      .addSelect('sr.terms', 'terms')
      .leftJoin('user', 'u', 'sr.created_by = u.id')
      .leftJoin('customer', 'c', 'sr.customer_id = c.id')
      .leftJoin('sub_organization', 'so', 'sr.sub_organization_id = so.id')
      .where('sr.organization_id = :organizationId', { organizationId })
      .andWhere('sr.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .andWhere('sr.customer_id = :customer', {
        customer,
      })
      .orderBy({ date_created: 'DESC' });
    // console.log(query)
    return query.getRawMany();
    // return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }

  async getSalesRequests(
    organizationId: number,
    subOrganizationId: number,
    state: string[] = [],
  ): Promise<any[]> {
    const query = this.SaleRequestRepository.createQueryBuilder('sr')
      .select('sr.id', 'id')
      .addSelect('sr.state', 'state')
      .addSelect('sr.sale_no', 'sale_no')
      .addSelect('sr.organization_id', 'organization_id')
      .addSelect('sr.sub_organization_id', 'sub_organization_id')
      .addSelect('sr.created_by', 'created_by')
      .addSelect('u.name', 'created_by_name')
      .addSelect('so.name', 'sub_organization_name')
      .addSelect('sr.date_created', 'date_created')
      .addSelect('sr.total', 'total')
      .addSelect('sr.notes', 'notes')
      .addSelect('sr.additional_cost', 'additional_cost')
      .addSelect('sr.balance_to_be_paid_on', 'balance_to_be_paid_on')
      .addSelect('sr.date_confirmation_on', 'date_confirmation_on')
      .addSelect('sr.item_cost', 'item_cost')
      .addSelect('sr.shipment_charges', 'shipment_charges')
      .addSelect('sr.amount_paid', 'amount_paid')
      .addSelect('sr.balance', 'balance')
      .addSelect('sr.subject', 'subject')
      .addSelect('sr.items_discount_total', 'items_discount_total')
      .addSelect('sr.overall_discount_total', 'overall_discount_total')
      .addSelect('sr.overall_discount', 'overall_discount')
      .addSelect('sr.invoice_date', 'invoice_date')
      .addSelect('sr.due_date', 'due_date')
      .addSelect('c.name', 'customer_name')
      .addSelect('sr.terms', 'terms')
      .leftJoin('user', 'u', 'sr.created_by = u.id')
      .leftJoin('customer', 'c', 'sr.customer_id = c.id')
      .leftJoin('sub_organization', 'so', 'sr.sub_organization_id = so.id')
      .where('sr.organization_id = :organizationId', { organizationId })
      .andWhere('sr.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .orderBy({ date_created: 'DESC' });
    if (state.length > 1) {
      query.andWhere('sr.state IN (:...state)', { state });
    } else if (state.length > 0) {
      query.andWhere('sr.state = :state', { state });
    }
    // console.log(query)
    return query.getRawMany();
    // return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }

  async getPurchaseRequest(
    organizationId: number,
    subOrganizationId: number,
    purchaseId: number,
  ): Promise<any> {
    const result = await this.PurchaseRequestRepository.createQueryBuilder('pr')
      .leftJoinAndSelect('pr.vendor', 'v')
      .leftJoinAndSelect('pr.created_by', 'u')
      .leftJoinAndSelect('pr.subOrganization', 'so')
      .select([
        'pr.id',
        'pr.state',
        'pr.isSiteBased',
        'pr.purchase_no',
        'pr.site_ids',
        'pr.organization_id',
        'pr.sub_organization_id',
        'pr.vendor_id',
        'v.name',
        'v.filename',
        'v.id',
        'pr.created_by',
        'u.name',
        'so.name',
        'pr.date_created',
        'pr.total',
        'pr.notes',
        'pr.additional_cost',
        'pr.balance_to_be_paid_on',
        'pr.date_confirmation_on',
        'pr.item_cost',
        'pr.shipment_charges',
        'pr.amount_paid',
        'pr.balance',
        'pr.subject',
        'pr.items_discount_total',
        'pr.overall_discount_total',
        'pr.overall_discount',
        'pr.invoice_date',
        'pr.due_date',
        'pr.sales_person',
        'pr.attachment',
        'pr.terms',
      ])
      .where('pr.purchase_no = :purchaseId', { purchaseId })
      .andWhere('pr.organization_id = :organizationId', { organizationId })
      .andWhere('pr.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .getOne();

    if (result && result.id) {
      const items = await this.PurchaseItemsRepository.findBy({
        purchase: { id: result.id },
      });

      result['items'] = items;
    }
    return result;
  }

  async getSaleRequests(
    organizationId: number,
    subOrganizationId: number,
  ): Promise<any[]> {
    const query = `
      SELECT * FROM get_all_purchase_requests($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [
      organizationId,
      subOrganizationId,
    ]);
  }

  async getSaleRequest(
    organizationId: number,
    subOrganizationId: number,
    saleId: number,
  ): Promise<any> {
    const result = await this.SaleRequestRepository.createQueryBuilder('sr')
      .leftJoinAndSelect('sr.created_by', 'u')
      .leftJoinAndSelect('sr.subOrganization', 'so')
      .leftJoinAndSelect('sr.customer', 'c')
      .select([
        'sr.id',
        'sr.state',
        'sr.organization_id',
        'sr.sub_organization_id',
        'sr.created_by',
        'sr.sale_no',
        'c.name',
        'c',
        'u.name',
        'so.name',
        'sr.date_created',
        'sr.total',
        'sr.notes',
        'sr.additional_cost',
        'sr.balance_to_be_paid_on',
        'sr.date_confirmation_on',
        'sr.item_cost',
        'sr.shipment_charges',
        'sr.amount_paid',
        'sr.balance',
        'sr.payment_history',
        'sr.subject',
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
      .andWhere('sr.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
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

  async getInventory(
    organizationId: number,
    subOrganizationId: number,
  ): Promise<any[]> {
    const inventoryItems: any = await this.inventoryItemRepository.find({
      where: {
        organization_id: organizationId,
        sub_organization_id: subOrganizationId,
      },
      relations: ['vendor'], // Assuming you have relations defined in your entity
    });
  
    // Group by item name and vendor name
    const groupedData = inventoryItems.reduce((acc, item) => {
      const key = `${item.name}-${item.vendor.name}`;
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
        item_name: items[0].name,
        vendor_name: items[0].vendor.name,
        latest_unit_price: latestStockInItem.unit_price,
        qty: totalRemainingQty,
        avg_unit_price: averageUnitPrice,
      };
    });
  
    return result;
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
    sub_organization_id: number,
    name: string,
  ): Promise<InventoryItem[]> {
    return name
      ? this.inventoryItemRepository.findBy({
          organization_id,
          sub_organization_id,
          name,
        })
      : this.inventoryItemRepository.findBy({
          organization_id,
          sub_organization_id,
        });
  }

  async getInventoryBySite(
    organization_id: number,
    sub_organization_id: number,
    siteId: number,
  ): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.findBy({
      organization_id,
      sub_organization_id,
      site_ids: Raw((alias) => `CAST(${alias} AS text) ILIKE '%${siteId}%'`),
    });
  }
}
