import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Organization,
  SubOrganization,
  Vendor,
  VendorItem,
} from './organization.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly OrganizationRepository: Repository<Organization>,
    @InjectRepository(SubOrganization)
    private readonly SubOrganizationRepository: Repository<SubOrganization>,

    @InjectRepository(Vendor)
    private readonly VendorRepository: Repository<Vendor>,
    @InjectRepository(VendorItem)
    private readonly VendorItemRepository: Repository<VendorItem>,
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

  async createSubOrganization(body): Promise<boolean> {
    console.log(body)
    const SubOrganization = this.SubOrganizationRepository.create(body);
    await this.SubOrganizationRepository.save(SubOrganization);
    return true;
  }
  async updateSubOrganization(body:any): Promise<boolean> {
    console.log(body)
    const SubOrganization = this.SubOrganizationRepository.create(body);
    await this.SubOrganizationRepository.update(
      { id: parseInt(body.id)},
      { ...body },
    );
    await this.SubOrganizationRepository.save(SubOrganization);
    return true;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.OrganizationRepository.find();
  }

  async getAllSubOrganizations(
    organization_id: string,
  ): Promise<SubOrganization[]> {
    return this.SubOrganizationRepository.findBy({
      organization_id: parseInt(organization_id),
    });
  }

  async getSubOrganizationDetails(
    organization_id: string,
    subOrg_id: string,
  ): Promise<SubOrganization> {
    return this.SubOrganizationRepository.findOneBy({
      organization_id: parseInt(organization_id),
      id: parseInt(subOrg_id),
    });
  }

  async getVendors(organization_id: number): Promise<Vendor[]> {
    return this.VendorRepository.find({
      where: { organization_id },
      order: { name: 'ASC' },
    });
  }

  async createVendor(
    organization_id: number,
    name: string,
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
    const vendor = this.VendorRepository.create({
      organization_id,
      name,
      filename: fileName,
    });
    return this.VendorRepository.save(vendor);
  }

  async updateVendor(
    vendor_id: string,
    { name, email, address, contact_no }: any,
    file,
  ): Promise<Vendor> {
    const updatedVendor = await this.VendorRepository.findOneBy({
      id: parseInt(vendor_id),
    });

    if (!updatedVendor) {
      throw new Error('Vendor not found');
    }

    let uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }


    // Delete the existing file if present
    if (updatedVendor.filename) {
      const existingFilePath = path.join(uploadDir, updatedVendor.filename);
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
    let body = { name, email, address, contact_no, filename: fileName }
    if (fileName) {
      body = { ...body, filename: fileName }
    }
    await this.VendorRepository.update(
      { id: parseInt(vendor_id) },
      body
    );

    // Find and return the updated vendor
    const updatedVendorAfterSave = await this.VendorRepository.findOneBy({
      id: parseInt(vendor_id),
    });

    if (!updatedVendorAfterSave) {
      // Handle case where vendor is not found after update
      throw new Error('Vendor not found after update');
    }

    return updatedVendorAfterSave;
  }

  async getVendorItems(vendor_id: number): Promise<VendorItem[]> {
    return this.VendorItemRepository.findBy({ vendor_id });
  }

  async createVendorItem(vendor_id, name: string): Promise<VendorItem> {
    const Site = this.VendorItemRepository.create({ vendor_id, name });
    return this.VendorItemRepository.save(Site);
  }

  async updateVendorItem(
    vendor_id: string,
    item_id: string,
    name: string,
  ): Promise<VendorItem> {
    await this.VendorItemRepository.update(
      { vendor_id: parseInt(vendor_id), id: parseInt(item_id) },
      { name },
    );
    // Find and return the updated user
    const updatedItem = await this.VendorItemRepository.findOneBy({
      id: parseInt(item_id),
    });
    if (!updatedItem) {
      // Handle case where user is not found after update
      throw new Error('Item not found after update');
    }
    return updatedItem;
  }
}
