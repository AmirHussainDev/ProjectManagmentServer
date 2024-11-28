import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Worklog,
  Employee,
  EmployeePayments,
  ClientPayments,
} from './employee.entity';
import { PaymentsController } from './payments/payments.controller';
import { TaskWorkLog } from 'src/site/site.entity';
import { Client } from 'src/organization/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Worklog,
      EmployeePayments,
      ClientPayments,
      TaskWorkLog,
      Client
    ]),
  ],
  controllers: [EmployeeController, PaymentsController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
