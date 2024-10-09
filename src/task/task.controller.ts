import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  InventoryItem,
  TaskItems,
  TaskRequest,
  SaleItems,
  SaleRequest,
} from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { TaskWorkLog } from 'src/site/site.entity';

@Controller('api/task')
export class InventoryTaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTaskRequest(
    @Body()
    requestDetails: {
      details: TaskRequest;
      products: TaskItems[];
    },
  ) {
    return this.taskService.createTaskRequest(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateTaskRequest(
    @Body()
    requestDetails: TaskRequest,
  ) {
    return this.taskService.updateTaskRequest(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sale')
  createSaleRequest(
    @Body() requestDetails: { details: SaleRequest; products: SaleItems[] },
  ) {
    return this.taskService.createSaleRequest(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('sale')
  updatesaleRequest(
    @Body() requestDetails: { details: SaleRequest; products: SaleItems[] },
  ) {
    return this.taskService.updateSaleRequest(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('task-request-by-id/:orgId/:clientId/:taskId')
  get_task_request(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskService.getTaskRequest(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(taskId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('task-request-by-state/:orgId/:clientId/:state')
  getTaskRequests(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('state') state: string,
  ) {
    return this.taskService.getTaskRequestsByState(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(state),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('task-request-by-filter/:orgId/:clientId')
  getTaskRequestsByFilter(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Query('state') state: string[],
  ) {
    return this.taskService.getTaskRequests(
      parseInt(orgId),
      parseInt(clientId),
      state,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sale-request-by-filter/:orgId/:clientId')
  getSaleRequestsByFilter(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Query('state') state: string[],
  ) {
    return this.taskService.getSalesRequests(
      parseInt(orgId),
      parseInt(clientId),
      state,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sale-request-by-customer/:orgId/:clientId/:customerId')
  getSaleRequestsByCustomer(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.taskService.getSalesRequestsByCustomer(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(customerId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sale-request-by-id/:orgId/:clientId/:saleId')
  get_sale_request(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('saleId') saleId: string,
  ) {
    return this.taskService.getSaleRequest(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(saleId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('inventory')
  async createInventoryItem(
    @Body() inventoryItemDto: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    return this.taskService.createInventoryItem(inventoryItemDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('inventory/:orgId/:clientId')
  async getInventoryItem(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ): Promise<InventoryItem[]> {
    return this.taskService.getInventory(parseInt(orgId), parseInt(clientId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('projectStats/:orgId/:clientId')
  async getProjectStats(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ): Promise<any> {
    return this.taskService.getProjectStats(
      parseInt(orgId),
      parseInt(clientId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('inventory/:orgId/:clientId/:siteId')
  async getInventoryBySiteItemDetails(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Param('siteId') siteId: string,
  ): Promise<InventoryItem[]> {
    return this.taskService.getInventoryBySite(
      parseInt(orgId),
      parseInt(clientId),
      parseInt(siteId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('inventory-item-details/:orgId/:clientId')
  async getInventoryItemDetails(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Query('name') name: string,
  ): Promise<InventoryItem[]> {
    return this.taskService.getInventoryItemDetails(
      parseInt(orgId),
      parseInt(clientId),
      name,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('taskWorklog')
  createSiteContractworklog(@Body() requestDetails: TaskWorkLog) {
    return this.taskService.createTaskWorkLog(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('taskWorklog/:orgId/:client/:taskId/')
  getSiteContractPayments(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('taskId') taskId: string,
  ) {
    return this.taskService.getTaskWorkLogs(
      parseInt(orgId),
      parseInt(client),
      parseInt(taskId),
    );
  }
}
