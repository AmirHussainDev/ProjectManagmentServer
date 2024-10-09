import { Test, TestingModule } from '@nestjs/testing';
import { InventoryTaskController } from './task.controller';

describe('InventoryTaskController', () => {
  let controller: InventoryTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryTaskController],
    }).compile();

    controller = module.get<InventoryTaskController>(InventoryTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
