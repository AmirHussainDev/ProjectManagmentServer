import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/Customers')
export class CustomerController {
  constructor(private readonly userService: CustomerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCustomer(@Body() body) {
    return this.userService.createCustomer(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateCustomer(@Body() body) {
    return this.userService.updateCustomer(body);
  }

  @UseGuards(AuthGuard('local'))
  @Get()
  getAllCustomers() {
    return this.userService.getAllCustomers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId/:subOrgId')
  getAllOrganizationCustomers(
    @Param('orgId') orgId: string,
    @Param('subOrgId') subOrgId: string,
  ) {
    return this.userService.findByOrganizationId(
      parseInt(orgId),
      parseInt(subOrgId),
    );
  }
}
