import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Organization,
  Client,
  Project,
  ProjectItem,
} from './organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Client,
      Project,
      ProjectItem,
    ]),
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
