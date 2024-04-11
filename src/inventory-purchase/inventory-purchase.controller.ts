import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InventoryPurchaseService } from './inventory-purchase.service';
import { InventoryItem, PurchaseItems, PurchaseRequest, SaleItems, SaleRequest } from './inventory-purchase.entity';

@Controller('inventory-purchase')
export class InventoryPurchaseController {

    constructor(private readonly inventoryPurcahseService: InventoryPurchaseService) { }

    @Post()
    createPurchaseRequest(@Body() requestDetails: { details: PurchaseRequest, products: PurchaseItems[] }) {
        console.log(requestDetails)
        return this.inventoryPurcahseService.createPurchaseRequest(requestDetails);
    }

    @Put()
    updatePurchaseRequest(@Body() requestDetails: { details: PurchaseRequest, products: PurchaseItems[] }) {
        console.log(requestDetails)
        return this.inventoryPurcahseService.updatePurchaseRequest(requestDetails);
    }

    @Post('sale')
    createSaleRequest(@Body() requestDetails: { details: SaleRequest, products: SaleItems[] }) {
        console.log(requestDetails)
        return this.inventoryPurcahseService.createSaleRequest(requestDetails);
    }

    @Put('sale')
    updatesaleRequest(@Body() requestDetails: { details: SaleRequest, products: SaleItems[] }) {
        console.log(requestDetails)
        return this.inventoryPurcahseService.updateSaleRequest(requestDetails);
    }


    @Get('purchase-request-by-id/:orgId/:purchaseId')
    get_purchase_request(@Param('orgId') orgId: string, @Param('purchaseId') purchaseId: string) {
        console.log('orgId', orgId, 'purchaseId', purchaseId)
        return this.inventoryPurcahseService.getPurchaseRequest(parseInt(orgId), parseInt(purchaseId));
    }

    @Get('purchase-request-by-state/:orgId/:subOrgId/:state')
    getPurchaseRequests(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getPurchaseRequestsByState(parseInt(orgId), parseInt(subOrgId), parseInt(state));
    }

    @Get('purchase-request-by-filter/:orgId/:subOrgId')
    getPurchaseRequestsByFilter(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getPurchaseRequests(parseInt(orgId), parseInt(subOrgId));
    }
    @Get('sale-request-by-filter/:orgId/:subOrgId')
    getSaleRequestsByFilter(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getSalesRequests(parseInt(orgId), parseInt(subOrgId));
    }
    @Get('sale-request-by-id/:orgId/:saleId')
    get_sale_request(@Param('orgId') orgId: string, @Param('saleId') saleId: string) {
        console.log('orgId', orgId, 'saleId', saleId)
        return this.inventoryPurcahseService.getSaleRequest(parseInt(orgId), parseInt(saleId));
    }

    @Post('inventory')
    async createInventoryItem(@Body() inventoryItemDto: Partial<InventoryItem>): Promise<InventoryItem> {
        return this.inventoryPurcahseService.createInventoryItem(inventoryItemDto);
    }

    @Get('inventory/:orgId/:subOrgId')
    async getInventoryItem(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string): Promise<InventoryItem[]> {
        return this.inventoryPurcahseService.getInventory(parseInt(orgId), parseInt(subOrgId));
    }

    @Get('inventory-item-details/:orgId/:subOrgId')
    async getInventoryItemDetails(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Query('name') name:string): Promise<InventoryItem[]> {  
        return this.inventoryPurcahseService.getInventoryItemDetails(parseInt(orgId), parseInt(subOrgId),name);
    }
}
