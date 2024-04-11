import { Test, TestingModule } from '@nestjs/testing';
import { InventoryPurchaseService } from './inventory-purchase.service';

describe('InventoryPurchaseService', () => {
  let service: InventoryPurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryPurchaseService],
    }).compile();

    service = module.get<InventoryPurchaseService>(InventoryPurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
