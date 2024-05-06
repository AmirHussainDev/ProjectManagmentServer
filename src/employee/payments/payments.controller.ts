import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from '../employee.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private employeeService: EmployeeService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPayments(@Body() body) {
        return this.employeeService.createPayments(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('employees/:orgId/:subOrgId')
    getAllEmployeeDuePayments(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string) {
        return this.employeeService.getAllEmployeeDuePayments(parseInt(orgId), parseInt(subOrgId));
    }

}
