import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { SiteService } from './site.service';
import { AuthGuard } from '@nestjs/passport';
import { SiteContracts, Site } from './site.entity';

@Controller('api/Sites')
export class SiteController {
    constructor(private readonly SiteService: SiteService) { }


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
    @Get(':orgId/:subOrg')
    getAllOrganizationSites(@Param('orgId') orgId: string, @Param('subOrg') subOrg: string) {
        return this.SiteService.findByOrganizationId(parseInt(orgId), parseInt(subOrg));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':orgId/:subOrg/:siteId')
    getSiteById(@Param('orgId') orgId: string, @Param('subOrg') subOrg: string, @Param('siteId') siteId: string) {
        return this.SiteService.findBySiteId(parseInt(orgId), parseInt(subOrg), parseInt(siteId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':orgId/:subOrg/:siteId')
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
    @Get('contracts/:orgId/:subOrg/:siteId')
    get_contracts_request(@Param('orgId') orgId: string, @Param('subOrg') subOrg: string,@Param('siteId') siteId: string) {
        return this.SiteService.getAllContracts(parseInt(orgId), parseInt(subOrg), parseInt(siteId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('contract/:organizationId/:siteId/:contractId')
    get_contract_request(@Param('organizationId') orgId: string, @Param('siteId') siteId: string,@Param('contractId') subOrg: string) {
        return this.SiteService.getContract(parseInt(orgId),parseInt(siteId),parseInt(subOrg));
    }
}
