import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from './employee.service';

@Controller('api/employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

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
  @Get(':orgId/:clientId')
  getAllUsers(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.employeeService.getAllEmployees(
      parseInt(orgId),
      parseInt(clientId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId/:clientId/:userId')
  getUserEmployeeDetails(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ) {
    return this.employeeService.getUserEmployeeDetails(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(userId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('currentEmployeeSubordinates/:orgId/:clientId/:userId')
  getCurrentEmployeeSubordinates(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('userId') userId: string,
  ) {
    return this.employeeService.getCurrentEmployeeSubordinates(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(userId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('worklog')
  createWorklog(@Body() body) {
    return this.employeeService.createWorklog(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('worklog')
  updateWorklog(@Body() body) {
    return this.employeeService.updateWorklog(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('payemployee/:orgId/:clientId/:employeeId')
  payEmployeeWorklog(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeService.payEmployeeWorklog(
      parseInt(clientId),
      parseInt(employeeId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('worklog/:orgId/:clientId/:employeeId')
  getAllWorklog(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.employeeService.getAllWorklog(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(employeeId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('worklog/currentEmployeeWorkLog/:orgId/:clientId/:employeeId')
  getcurrentEmployeeWorkLog(
    @Param('employeeId') employeeId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.employeeService.getcurrentEmployeeWorkLog(
      parseInt(employeeId),
      parseInt(clientId),
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('worklog/currentDayWorklog/:orgId/:clientId/:userId')
  getCurrentDateWorklog(@Param('userId') userId: string) {
    return this.employeeService.getCurrentDateWorklog(parseInt(userId));
  }
}
