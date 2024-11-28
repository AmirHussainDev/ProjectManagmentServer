import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Organization,
  Client,
  Project,
  ProjectItem,
} from './organization.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly OrganizationRepository: Repository<Organization>,
    @InjectRepository(Client)
    private readonly ClientRepository: Repository<Client>,

    @InjectRepository(Project)
    private readonly ProjectRepository: Repository<Project>,
    @InjectRepository(ProjectItem)
    private readonly ProjectItemRepository: Repository<ProjectItem>,
  ) { }

  async createOrganization(
    name: string,
    domain_name: string,
    icon: string,
    image: string,
  ): Promise<Organization> {
    const Organization = this.OrganizationRepository.create({
      name,
      domain_name,
      icon,
      image,
    });
    return this.OrganizationRepository.save(Organization);
  }

  async createClient(body): Promise<boolean> {
    console.log(body);
    const Client = this.ClientRepository.create(body);
    await this.ClientRepository.save(Client);
    return true;
  }
  async updateClient(body: any): Promise<boolean> {
    console.log(body);
    const Client = this.ClientRepository.create(body);
    await this.ClientRepository.update({ id: parseInt(body.id) }, { ...body });
    await this.ClientRepository.save(Client);
    return true;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.OrganizationRepository.find();
  }

  async getAllClients(organization_id: string): Promise<Client[]> {
    return this.ClientRepository.find({
      where: {
        organization_id: parseInt(organization_id),
      },
      relations: ['owner'],
    });
  }

  async getClientDetails(
    organization_id: string,
    client_id: string,
  ): Promise<Client> {
    return this.ClientRepository.findOneBy({
      organization_id: parseInt(organization_id),
      id: parseInt(client_id),
    });
  }

  async getProjects(organization, client): Promise<Project[]> {
    return this.ProjectRepository.find({
      where: { organization, client },
      order: { name: 'ASC' },
    });
  }

  async createProject(
    organization,
    client,
    name: string,
    description: string,
    file,
  ): Promise<any> {
    const uploadDir = path.join('', '..', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let filePath = '';
    let fileName = '';
    if (file) {
      fileName = `${Date.now()}-${file.originalname}`;
      filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
    }
    const project = this.ProjectRepository.create({
      organization,
      client,
      description,
      name,
      filename: fileName,
    });
    return this.ProjectRepository.save(project);
  }

  async updateProject(
    project_id: string,
    { name, description }: any,
    file,
  ): Promise<Project> {
    const updatedProject = await this.ProjectRepository.findOneBy({
      id: parseInt(project_id),
    });

    if (!updatedProject) {
      throw new Error('Project not found');
    }

    let uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete the existing file if present
    if (file && updatedProject.filename) {
      const existingFilePath = path.join(uploadDir, updatedProject.filename);
      if (fs.existsSync(existingFilePath)) {
        fs.unlinkSync(existingFilePath);
      }
    }
    let filePath = '';
    let fileName = '';
    uploadDir = path.join('', '..', 'uploads');

    if (file) {
      fileName = `${Date.now()}-${file.originalname}`;
      filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
    }
    let body = { name, description, filename: fileName };
    if (fileName) {
      body = { ...body, filename: fileName };
    }
    await this.ProjectRepository.update({ id: parseInt(project_id) }, body);

    // Find and return the updated project
    const updatedProjectAfterSave = await this.ProjectRepository.findOneBy({
      id: parseInt(project_id),
    });

    if (!updatedProjectAfterSave) {
      // Handle case where project is not found after update
      throw new Error('Project not found after update');
    }

    return updatedProjectAfterSave;
  }

  async getProjectItems(project_id: number): Promise<ProjectItem[]> {
    return this.ProjectItemRepository.findBy({ project_id });
  }

  async createProjectItem(project_id, name: string): Promise<ProjectItem> {
    const Site = this.ProjectItemRepository.create({ project_id, name });
    return this.ProjectItemRepository.save(Site);
  }

  async updateProjectItem(
    project_id: string,
    item_id: string,
    name: string,
  ): Promise<ProjectItem> {
    await this.ProjectItemRepository.update(
      { project_id: parseInt(project_id), id: parseInt(item_id) },
      { name },
    );
    // Find and return the updated user
    const updatedItem = await this.ProjectItemRepository.findOneBy({
      id: parseInt(item_id),
    });
    if (!updatedItem) {
      // Handle case where user is not found after update
      throw new Error('Item not found after update');
    }
    return updatedItem;
  }
}
