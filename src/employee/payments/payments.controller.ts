import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from '../employee.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private employeeService: EmployeeService) {

    }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPayments(@Body() body) {
        return this.employeeService.createPayments(body);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('employees/:orgId/:clientId')
    getAllEmployeeDuePayments(@Param('orgId') orgId: string, @Param('clientId') clientId: string) {
        return this.employeeService.getAllEmployeeDuePayments(parseInt(orgId), parseInt(clientId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('employee/:orgId/:clientId/:employeeId')
    getAllEmployeePayments(@Param('orgId') orgId: string, @Param('clientId') clientId: string, @Param('employeeId') employeeId: string) {
        return this.employeeService.getAllEmployeePayments(parseInt(orgId), parseInt(clientId), parseInt(employeeId));
    }

}
