import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from '../employee.service';

@Controller('api/payments')
export class PaymentsController {
    constructor(private employeeService: EmployeeService) { }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    createPayments(@Body() body) {
        return this.employeeService.createPayments(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('employees/:orgId/:clientId')
    getAllEmployeeDuePayments(
        @Param('orgId') orgId: string,
        @Param('clientId') clientId: string,
    ) {
        return this.employeeService.getAllEmployeeDuePayments(
            parseInt(orgId),
            parseInt(clientId),
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('employee/:orgId/:clientId/:employeeId')
    getAllEmployeePayments(
        @Param('orgId') orgId: string,
        @Param('clientId') clientId: string,
        @Param('employeeId') employeeId: string,
    ) {
        return this.employeeService.getAllEmployeePayments(
            parseInt(orgId),
            parseInt(clientId),
            parseInt(employeeId),
        );
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('client/:orgId/:clientId')
    createClientPayment(@Body() body) {
        return this.employeeService.createClientPayments(body);
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('client/:orgId/:clientId')
    async getProjectBudgetDetail(@Param('clientId') clientId: string) {
        return this.employeeService.getClientBudgetDetail(Number(clientId || 0));
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('client/expense/:orgId/:clientId')
    getClientExpenseSummary(@Param('clientId') clientId: string) {
        return this.employeeService.getClientExpenseSummary(Number(clientId || 0));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('client/expense/all/:orgId/:clientId')
    getClientExpenseGroupedByClientId() {
        return this.employeeService.getClientExpenseGroupedByClientId();
    }

}
