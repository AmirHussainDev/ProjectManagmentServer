import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SiteService } from './site.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/Sites')
export class SiteController {
    constructor(private readonly SiteService: SiteService) { }


    @UseGuards(AuthGuard('jwt'))
    @Post()
    createSite(@Body() { organization_id, name }: { organization_id, name: string; password: string }) {
        return this.SiteService.createSite(organization_id, name);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllSites() {
        return this.SiteService.getAllSites();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':orgId')
    getAllOrganizationSites(@Param('orgId') orgId: string) {
        return this.SiteService.findByOrganizationId(parseInt(orgId));
    }
}
