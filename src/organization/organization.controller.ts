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
import { Project } from './organization.entity';
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
  @Post('client')
  createClient(
    @Body()
    body,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.createClient(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('client')
  updateClient(
    @Body()
    body,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.updateClient(body);
  }

  @Get('project/:orgId/:clientId')
  getProjects(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.organizationService.getProjects(
      parseInt(orgId),
      parseInt(clientId),
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('project/:orgId/:clientId')
  createProject(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
    @Body() { name, description }: { name: string; description: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Project> {
    return this.organizationService.createProject(
      parseInt(orgId),
      parseInt(clientId),
      name,
      description,
      file,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('project/:orgId/:projectId')
  updateProject(
    @Param('projectId') projectId: string,
    @Body() body: { name: string; description: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationService.updateProject(projectId, body, file);
  }

  @Get('project-items/:orgId/:projectId')
  getProjectItems(
    @Param('orgId') orgId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.organizationService.getProjectItems(parseInt(projectId));
  }

  @Post('project-item/:orgId/:projectId')
  createProjectItem(
    @Param('projectId') projectId: string,
    @Body() { name }: { name: string },
  ) {
    return this.organizationService.createProjectItem(projectId, name);
  }

  @Put('project-item/:orgId/:projectId/:itemId')
  updateProjectItem(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
    @Body() { name }: { name: string },
  ) {
    return this.organizationService.updateProjectItem(projectId, itemId, name);
  }

  @Get(':orgId')
  getSubAllOrganizations(@Param('orgId') orgId: string) {
    return this.organizationService.getAllClients(orgId);
  }

  @Get(':orgId/:clientId')
  getUserClients(
    @Param('orgId') orgId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.organizationService.getClientDetails(orgId, clientId);
  }
}
