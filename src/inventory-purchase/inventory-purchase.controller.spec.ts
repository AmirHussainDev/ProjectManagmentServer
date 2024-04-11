import { Test, TestingModule } from '@nestjs/testing';
import { InventoryPurchaseController } from './inventory-purchase.controller';

describe('InventoryPurchaseController', () => {
  let controller: InventoryPurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryPurchaseController],
    }).compile();

    controller = module.get<InventoryPurchaseController>(InventoryPurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
