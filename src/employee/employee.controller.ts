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
    
    @UseGuards(AuthGuard('jwt'))
    @Get(':orgId/:subOrgId/:userId')
    getUserEmployeeDetails(@Param('orgId') orgId: string,@Param('subOrgId') subOrgId: string,@Param('userId') userId: string) {
        return this.employeeService.getUserEmployeeDetails(parseInt(orgId),parseInt(subOrgId),parseInt(userId));
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('currentEmployeeSubordinates/:orgId/:subOrgId/:userId')
    getCurrentEmployeeSubordinates(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string, @Param('userId') userId: string) {
        return this.employeeService.getCurrentEmployeeSubordinates(parseInt(orgId),parseInt(subOrgId),parseInt(userId));
    }
   

    @UseGuards(AuthGuard('jwt'))
    @Post('attendance')
    createAttendance(@Body() body) {
        return this.employeeService.createAttendance(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('attendance')
    updateAttendance(@Body() body) {
        return this.employeeService.updateAttendance(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('attendance/:orgId/:subOrgId/:employeeId')
    getAllAttendance(@Param('orgId') orgId: string,@Param('subOrgId') subOrgId: string,@Param('employeeId') employeeId: string) {
        return this.employeeService.getAllAttendance(parseInt(orgId),parseInt(subOrgId),parseInt(employeeId));
    }

    

    @UseGuards(AuthGuard('jwt'))
    @Get('attendance/currentEmployeeAttendance/:orgId/:subOrgId/:employeeId')
    getCurrentEmployeeAttendance(@Param('employeeId') employeeId: string) {
        return this.employeeService.getCurrentEmployeeAttendance(parseInt(employeeId));
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('attendance/currentDayAttendance/:orgId/:subOrgId/:userId')
    getCurrentDateAttendance(@Param('userId') userId: string) {
        return this.employeeService.getCurrentDateAttendance(parseInt(userId));
    }

}
