import { Module } from '@nestjs/common';
import { InventoryPurchaseController } from './inventory-purchase.controller';
import { InventoryPurchaseService } from './inventory-purchase.service';
import { InventoryItem, PurchaseItems, PurchaseRequest, SaleItems, SaleRequest } from './inventory-purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports: [
    TypeOrmModule.forFeature([PurchaseRequest,PurchaseItems,SaleRequest,SaleItems,InventoryItem]),
  ],
  providers: [InventoryPurchaseService],
  controllers: [InventoryPurchaseController],
})
export class InventoryPurchaseModule { }
