import { Module } from '@nestjs/common';
import { InventoryTaskController } from './task.controller';
import { TaskService } from './task.service';
import {
  InventoryItem,
  TaskItems,
  TaskRequest,
  SaleItems,
  SaleRequest,
} from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectItem } from 'src/organization/organization.entity';
import { TaskWorkLog } from 'src/site/site.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskRequest,
      TaskItems,
      SaleRequest,
      SaleItems,
      InventoryItem,
      ProjectItem,
      TaskWorkLog
    ]),
  ],
  providers: [TaskService],
  controllers: [InventoryTaskController],
})
export class InventoryTaskModule {}
