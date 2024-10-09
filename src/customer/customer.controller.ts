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
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCustomer(@Body() body) {
    return this.customerService.createCustomer(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateCustomer(@Body() body) {
    return this.customerService.updateCustomer(body);
  }

  @UseGuards(AuthGuard('local'))
  @Get()
  getAllCustomers() {
    return this.customerService.getAllCustomers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId/:clientId')
  getAllOrganizationCustomers(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.customerService.findByOrganizationId(
      parseInt(orgId),
      parseInt(clientId),
    );
  }
}
