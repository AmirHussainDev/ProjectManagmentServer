import { Controller, Get, Post, Body, Param, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Vendor } from './organization.entity';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Post()
    createOrganization(@Body() { name, domain_name, icon, image }: { name: string, domain_name: string; icon: string, image: string }) {
        return this.organizationService.createOrganization(name, domain_name, icon, image);
    }

    @Post()
    createSubOrganization(@Body() { name, organization_id }: { name: string, organization_id: number }) {
        return this.organizationService.createSubOrganization(name, organization_id);
    }

    @Get()
    getAllOrganizations() {
        return this.organizationService.getAllOrganizations();
    }



    @Get('vendor/:orgId')
    getVendors(@Param('orgId') orgId: string) {
        console.log("orgId", orgId);
        return this.organizationService.getVendors(parseInt(orgId));
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('vendor/:orgId')
    createVendor(@Param('orgId') orgId: string,
        @Body() { name }: { name: string; },
        @UploadedFile() file: Express.Multer.File
    ): Promise<Vendor> {
        return this.organizationService.createVendor(parseInt(orgId), name,file);
    }

    @Put('vendor/:orgId/:vendorId')
    updateVendor(@Param('vendorId') vendorId: string, @Body() { name }: { name: string; }) {
        return this.organizationService.updateVendor(vendorId, name);
    }

    @Get('vendor-items/:orgId/:vendorId')
    getVendorItems(@Param('orgId') orgId: string, @Param('vendorId') vendorId: string) {
       console.log(orgId,'vendorId',vendorId)
        return this.organizationService.getVendorItems(parseInt(vendorId));
    }

    @Post('vendor-item/:orgId/:vendorId')
    createVendorItem(@Param('vendorId') vendorId: string, @Body() { name }: { name: string; }) {
        return this.organizationService.createVendorItem(vendorId, name);
    }

    @Put('vendor-item/:orgId/:vendorId/:itemId')
    updateVendorItem(@Param('vendorId') vendorId: string, @Param('itemId') itemId: string, @Body() { name }: { name: string; }) {
        return this.organizationService.updateVendorItem(vendorId, itemId, name);
    }

    @Get(':orgId')
    getSubAllOrganizations(@Param('orgId') orgId: string) {
        return this.organizationService.getAllSubOrganizations(orgId);
    }

    @Get(':orgId/:subOrgId')
    getUserSubOrganizations(@Param('orgId') orgId: string, @Param('subOrgId') subOrgId: string) {
        console.log(orgId, subOrgId)
        return this.organizationService.getSubOrganizationDetails(orgId, subOrgId);
    }
}
