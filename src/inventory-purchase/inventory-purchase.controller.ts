import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { InventoryPurchaseService } from './inventory-purchase.service';
import { InventoryItem, PurchaseItems, PurchaseRequest, SaleItems, SaleRequest } from './inventory-purchase.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/inventory-purchase')
export class InventoryPurchaseController {

    constructor(private readonly inventoryPurcahseService: InventoryPurchaseService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPurchaseRequest(@Body() requestDetails: { details: PurchaseRequest, products: PurchaseItems[] }) {
        return this.inventoryPurcahseService.createPurchaseRequest(requestDetails);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    updatePurchaseRequest(@Body() requestDetails: { details: PurchaseRequest, products: PurchaseItems[] }) {
        return this.inventoryPurcahseService.updatePurchaseRequest(requestDetails);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('sale')
    createSaleRequest(@Body() requestDetails: { details: SaleRequest, products: SaleItems[] }) {
        return this.inventoryPurcahseService.createSaleRequest(requestDetails);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('sale')
    updatesaleRequest(@Body() requestDetails: { details: SaleRequest, products: SaleItems[] }) {
        return this.inventoryPurcahseService.updateSaleRequest(requestDetails);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('purchase-request-by-id/:orgId/:purchaseId')
    get_purchase_request(@Param('orgId') orgId: string, @Param('purchaseId') purchaseId: string) {
        return this.inventoryPurcahseService.getPurchaseRequest(parseInt(orgId), parseInt(purchaseId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('purchase-request-by-state/:orgId/:subOrgId/:state')
    getPurchaseRequests(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getPurchaseRequestsByState(parseInt(orgId), parseInt(subOrgId), parseInt(state));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('purchase-request-by-filter/:orgId/:subOrgId')
    getPurchaseRequestsByFilter(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getPurchaseRequests(parseInt(orgId), parseInt(subOrgId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('sale-request-by-filter/:orgId/:subOrgId')
    getSaleRequestsByFilter(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('state') state: string) {
        return this.inventoryPurcahseService.getSalesRequests(parseInt(orgId), parseInt(subOrgId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('sale-request-by-id/:orgId/:saleId')
    get_sale_request(@Param('orgId') orgId: string, @Param('saleId') saleId: string) {
        return this.inventoryPurcahseService.getSaleRequest(parseInt(orgId), parseInt(saleId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('inventory')
    async createInventoryItem(@Body() inventoryItemDto: Partial<InventoryItem>): Promise<InventoryItem> {
        return this.inventoryPurcahseService.createInventoryItem(inventoryItemDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('inventory/:orgId/:subOrgId')
    async getInventoryItem(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string): Promise<InventoryItem[]> {
        return this.inventoryPurcahseService.getInventory(parseInt(orgId), parseInt(subOrgId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('inventory-item-details/:orgId/:subOrgId')
    async getInventoryItemDetails(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Query('name') name:string): Promise<InventoryItem[]> {  
        return this.inventoryPurcahseService.getInventoryItemDetails(parseInt(orgId), parseInt(subOrgId),name);
    }
}
