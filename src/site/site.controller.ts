import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { AuthGuard } from '@nestjs/passport';
import {
  SiteContracts,
  Site,
  SiteExpenses,
  SiteOwnerPayments,
  TaskWorkLog,
  SiteContractorPayments,
} from './site.entity';
import { SiteStatisticsDto } from './site.interface.dto';

@Controller('api/Sites')
export class SiteController {
  constructor(private readonly SiteService: SiteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createSite(@Body() details) {
    return this.SiteService.createSite(details);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllSites() {
    return this.SiteService.getAllSites();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/statistics')
  async getSiteStatistics(
    @Param('id') siteId: number,
  ): Promise<SiteStatisticsDto> {
    return this.SiteService.getSiteStatistics(siteId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('statistics/all/:orgId/:client')
  async getAllSitesStatistics(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
  ): Promise<SiteStatisticsDto[]> {
    return this.SiteService.getAllSitesStatistics(
      parseInt(orgId),
      parseInt(client),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId/:client')
  getAllOrganizationSites(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
  ) {
    return this.SiteService.findByOrganizationId(
      parseInt(orgId),
      parseInt(client),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId/:client/:siteId')
  getSiteById(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('siteId') siteId: string,
  ) {
    return this.SiteService.findBySiteId(
      parseInt(orgId),
      parseInt(client),
      parseInt(siteId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':orgId/:client/:siteId')
  updateSiteDetails(@Body() requestDetails: Site) {
    return this.SiteService.updateSiteDetails(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('contractors')
  createSiteContracts(@Body() requestDetails: SiteContracts) {
    return this.SiteService.createSiteContracts(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('contract')
  updateSiteContracts(@Body() requestDetails: SiteContracts) {
    return this.SiteService.updateSiteContracts(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('contracts/:orgId/:client/:siteId')
  get_contracts_request(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('siteId') siteId: string,
  ) {
    return this.SiteService.getAllContracts(
      parseInt(orgId),
      parseInt(client),
      parseInt(siteId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('contract/:organizationId/:siteId/:contractId')
  get_contract_request(
    @Param('organizationId') orgId: string,
    @Param('siteId') siteId: string,
    @Param('contractId') client: string,
  ) {
    return this.SiteService.getContract(
      parseInt(orgId),
      parseInt(siteId),
      parseInt(client),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('expenses')
  createSiteExpense(@Body() requestDetails: SiteExpenses) {
    return this.SiteService.createSiteExpenses(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('expenses')
  updateSiteExpenses(@Body() requestDetails: SiteContracts) {
    return this.SiteService.updateSiteExpenses(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('expenses/:orgId/:client/:siteId')
  getSiteExpenses(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('siteId') siteId: string,
  ) {
    return this.SiteService.getSiteExpenses(
      parseInt(orgId),
      parseInt(client),
      parseInt(siteId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ownerpayment')
  createSiteOwnerPayment(@Body() requestDetails: SiteOwnerPayments) {
    return this.SiteService.createSiteOwnerPayment(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('ownerpayment')
  updateSiteOwnerPayments(@Body() requestDetails: SiteOwnerPayments) {
    return this.SiteService.updateSiteOwnerPayments(requestDetails);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('ownerpayment/:orgId/:client/:siteId')
  getSiteOwnerPayments(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('siteId') siteId: string,
  ) {
    return this.SiteService.getSiteOwnerPayments(
      parseInt(orgId),
      parseInt(client),
      parseInt(siteId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('contractorspayment/:orgId/:client/:siteId')
  getSiteContractorsPayments(
    @Param('orgId') orgId: string,
    @Param('client') client: string,
    @Param('siteId') siteId: string,
  ) {
    return this.SiteService.getSiteContractorsPayments(
      parseInt(orgId),
      parseInt(client),
      parseInt(siteId),
    );
  }

}
