import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('api/Sites')
export class SiteController {
    constructor(private readonly SiteService: SiteService) { }

    @Post()
    createSite(@Body() { organization_id, name }: { organization_id, name: string; password: string }) {
        return this.SiteService.createSite(organization_id, name);
    }

    @Get()
    getAllSites() {
        return this.SiteService.getAllSites();
    }

    @Get(':orgId')
    getAllOrganizationSites(@Param('orgId') orgId: string) {
        return this.SiteService.findByOrganizationId(parseInt(orgId));
    }
}
