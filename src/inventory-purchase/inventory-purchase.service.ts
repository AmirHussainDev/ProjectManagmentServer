import { Injectable } from '@nestjs/common';
import { InventoryItem, PurchaseItems, PurchaseRequest, SaleItems, SaleRequest } from './inventory-purchase.entity';
import { Repository, getConnection, getManager } from 'typeorm';
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
  ) { }

  async createPurchaseRequest(itemDetails: { details: PurchaseRequest, products: PurchaseItems[] }): Promise<PurchaseRequest> {
    const purchase = this.PurchaseRequestRepository.create(itemDetails.details);
    const resp = await this.PurchaseRequestRepository.save(purchase);
    itemDetails.products = itemDetails.products.map(item => ({ ...item, purchase_id: resp.id }))
    console.log(resp, itemDetails.products)
    const purchaseItems = this.PurchaseItemsRepository.save(itemDetails.products);
    return resp;
  }

  async updatePurchaseRequest(itemDetails: { details: PurchaseRequest, products: PurchaseItems[] }): Promise<boolean> {
    // Update the purchase request details in the PurchaseRequestRepository
    await this.PurchaseRequestRepository.update(itemDetails.details.id, itemDetails.details);

    // Update each purchase item in the PurchaseItemsRepository
    for (const product of itemDetails.products) {

      await this.PurchaseItemsRepository.update(product.id, product);
    }

    if (itemDetails.details.state == 4) {
      const po = await this.PurchaseRequestRepository.findOneBy({ id: itemDetails.details.id });
      const products = await this.PurchaseItemsRepository.findBy({ purchase_id: po.id })
      console.log(po, products)
      for (const product of products) {
        if (!product.isCustom) {
          const inventory = {
            organization_id: po.organization_id,
            sub_organization_id: po.sub_organization_id,
            purchase_id: po.id,
            stock_in: true,
            name: product.name,
            vendor_id: po.vendor_id,
            qty: product.qty,
            unit_price: product.unit_price,
            description: po.subject,
            total: product.total,
            date_created: new Date()
          }
          const inventoryItem = this.inventoryItemRepository.create(inventory);
          console.log(inventoryItem)
          await this.inventoryItemRepository.save(inventoryItem);
        }
      }
    }
    // Return true indicating the update was successful
    return true;
  }

  async createSaleRequest(itemDetails: { details: SaleRequest, products: SaleItems[] }): Promise<SaleRequest> {
    const sale = this.SaleRequestRepository.create(itemDetails.details);
    const resp = await this.SaleRequestRepository.save(sale);
    itemDetails.products = itemDetails.products.map(item => ({ ...item, sale_id: resp.id }))
    console.log(resp, itemDetails.products)
    const saleItems = this.SaleItemsRepository.save(itemDetails.products);
    return resp;
  }

  async updateSaleRequest(itemDetails: { details: SaleRequest, products: SaleItems[] }): Promise<boolean> {
    // Update the sale request details in the SaleRequestRepository
    await this.SaleRequestRepository.update(itemDetails.details.id, itemDetails.details);

    // Update each Sale item in the SaleItemsRepository
    for (const product of itemDetails.products) {

      await this.SaleItemsRepository.update(product.id, product);
    }
    if (itemDetails.details.state == 4) {
      const so = await this.SaleRequestRepository.findOneBy({ id: itemDetails.details.id });
      console.log(so)
      const products = await this.SaleItemsRepository.findByIds(itemDetails.products.map(pr => pr.id))
      console.log(so)
      for (const product of products) {
        const inventory = {
          organization_id: so.organization_id,
          sub_organization_id: so.sub_organization_id,
          sale_id: so.id,
          stock_in: false,
          name: product.name,
          vendor_id: product.vendor_id,
          qty: (product.qty - product.return_details.reduce((total, obj) => total + (obj.qty * 1), 0)),
          unit_price: product.unit_price,
          description: so.subject,
          total: product.total - this.sumReturnAmount(product.return_details),
          date_created: new Date()
        }
        const inventoryItem = this.inventoryItemRepository.create(inventory);
        console.log(inventoryItem)
        await this.inventoryItemRepository.save(inventoryItem);
      }
    }


    // Return true indicating the update was successful
    return true;
  }

  sumReturnAmount(return_details: any[]): number {
    let totalReturnAmount = 0;

    (return_details as any[]).forEach(returnDetail => {
      totalReturnAmount += returnDetail.returnAmount;
    });

    return totalReturnAmount;
  }

  async getPurchaseRequestsByState(organizationId: number, subOrganizationId: number, state: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_purchase_requests($1, $2, $3)
    `;
    return await this.PurchaseRequestRepository.query(query, [state, organizationId, subOrganizationId]);
  }

  async getPurchaseRequests(organizationId: number, subOrganizationId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_all_purchase_requests($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }

  async getSalesRequests(organizationId: number, subOrganizationId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_all_sale_requests($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }


  async getPurchaseRequest(organizationId: number, purchaseId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_purchase_request($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [purchaseId, organizationId]);
  }

  async getSaleRequests(organizationId: number, subOrganizationId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_all_purchase_requests($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }

  async getSaleRequest(organizationId: number, saleId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_sale_request($1, $2)
    `;
    return await this.SaleRequestRepository.query(query, [saleId, organizationId]);
  }

  async createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const inventoryItem = this.inventoryItemRepository.create(data);
    return await this.inventoryItemRepository.save(inventoryItem);
  }

  async getInventory(organizationId: number, subOrganizationId: number): Promise<any[]> {
    const query = `
      SELECT * FROM get_inventory_items($1, $2)
    `;
    return await this.PurchaseRequestRepository.query(query, [organizationId, subOrganizationId]);
  }

  async getInventoryItemDetails(organization_id: number, sub_organization_id: number, name: string): Promise<InventoryItem[]> {
    return name ? this.inventoryItemRepository.findBy({ organization_id, sub_organization_id, name }) 
    : this.inventoryItemRepository.findBy({ organization_id, sub_organization_id });

  }

}
