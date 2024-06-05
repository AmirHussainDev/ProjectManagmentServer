import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Organization,
  SubOrganization,
  Vendor,
  VendorItem,
} from './organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      SubOrganization,
      Vendor,
      VendorItem,
    ]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
