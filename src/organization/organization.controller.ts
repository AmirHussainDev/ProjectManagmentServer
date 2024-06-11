import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Vendor } from './organization.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createOrganization(
    @Body()
    {
      name,
      domain_name,
      icon,
      image,
    }: {
      name: string;
      domain_name: string;
      icon: string;
      image: string;
    },
  ) {
    return this.organizationService.createOrganization(
      name,
      domain_name,
      icon,
      image,
    );
  }

  // @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @Post('subOrg')
  createSubOrganization(
    @Body()
    body,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.createSubOrganization(body);
  }

  @Get('vendor/:orgId')
  getVendors(@Param('orgId') orgId: string) {
    return this.organizationService.getVendors(parseInt(orgId));
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('vendor/:orgId')
  createVendor(
    @Param('orgId') orgId: string,
    @Body() { name }: { name: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Vendor> {
    return this.organizationService.createVendor(parseInt(orgId), name, file);
  }

  @Put('vendor/:orgId/:vendorId')
  updateVendor(
    @Param('vendorId') vendorId: string,
    @Body() body: { name: string },
  ) {
    return this.organizationService.updateVendor(vendorId, body);
  }

  @Get('vendor-items/:orgId/:vendorId')
  getVendorItems(
    @Param('orgId') orgId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.organizationService.getVendorItems(parseInt(vendorId));
  }

  @Post('vendor-item/:orgId/:vendorId')
  createVendorItem(
    @Param('vendorId') vendorId: string,
    @Body() { name }: { name: string },
  ) {
    return this.organizationService.createVendorItem(vendorId, name);
  }

  @Put('vendor-item/:orgId/:vendorId/:itemId')
  updateVendorItem(
    @Param('vendorId') vendorId: string,
    @Param('itemId') itemId: string,
    @Body() { name }: { name: string },
  ) {
    return this.organizationService.updateVendorItem(vendorId, itemId, name);
  }

  @Get(':orgId')
  getSubAllOrganizations(@Param('orgId') orgId: string) {
    return this.organizationService.getAllSubOrganizations(orgId);
  }

  @Get(':orgId/:subOrgId')
  getUserSubOrganizations(
    @Param('orgId') orgId: string,
    @Param('subOrgId') subOrgId: string,
  ) {
    return this.organizationService.getSubOrganizationDetails(orgId, subOrgId);
  }
}
