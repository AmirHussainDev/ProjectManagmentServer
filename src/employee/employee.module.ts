import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance, Employee, EmployeePayments } from './employee.entity';
import { PaymentsController } from './payments/payments.controller';

@Module({
  imports:[ TypeOrmModule.forFeature([Employee,Attendance,EmployeePayments]),],
  controllers: [EmployeeController, PaymentsController],
  providers: [EmployeeService]
})
export class EmployeeModule {}
