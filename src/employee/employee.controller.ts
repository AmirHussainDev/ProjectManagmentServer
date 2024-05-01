import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from './employee.service';

@Controller('api/employee')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    createUser(@Body() body) {
        return this.employeeService.createEmployee(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put()
    updateUser(@Body() body) {
        return this.employeeService.updateEmployee(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':orgId/:subOrgId')
    getAllUsers(@Param('orgId') orgId: string,@Param('subOrgId') subOrgId: string) {
        return this.employeeService.getAllEmployees(parseInt(orgId),parseInt(subOrgId));
    }

}
