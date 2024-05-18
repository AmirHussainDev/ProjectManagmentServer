import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly CustomerRepository: Repository<Customer>,
  ) {}

  async createCustomer(userObj: any): Promise<Customer> {
    const Customer = this.CustomerRepository.create(userObj);
    return this.CustomerRepository.save(Customer) as any;
  }
  async updateCustomer(userObj: any): Promise<Customer> {
    // Update the user
    await this.CustomerRepository.update(
      { id: userObj.id, organization: userObj.organization_id },
      userObj,
    );

    // Find and return the updated user
    const updatedCustomer = await this.CustomerRepository.findOneBy({
      id: userObj.id,
      organization: userObj.organization_id,
    });
    if (!updatedCustomer) {
      // Handle case where user is not found after update
      throw new Error('Customer not found after update');
    }
    return updatedCustomer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.CustomerRepository.find();
  }

  async findByCustomername(
    organization_id: number,
    name: string,
  ): Promise<Customer> {
    return this.CustomerRepository.findOneBy({
      organization: { id: organization_id },
      name,
    });
  }

  async findByOrganizationId(organization_id: number, subOrgId: number) {
    return this.CustomerRepository.findBy({
      organization: { id: organization_id },
      subOrganization: { id: subOrgId },
    });
  }
}
