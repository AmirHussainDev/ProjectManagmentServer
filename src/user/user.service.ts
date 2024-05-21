import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async createUser(userObj: any): Promise<User> {
    const hash = bcrypt.hashSync(userObj.password, 10);
    const User = this.UserRepository.create({ ...userObj, password: hash });
    return this.UserRepository.save(User) as any;
  }
  async updateUser(userObj: any): Promise<User> {
    // Update the user
    await this.UserRepository.update(
      { id: userObj.id, organization_id: userObj.organization_id },
      {
        role: { id: userObj.role_id },
        reports_to: userObj.reports_to,
        name: userObj.name,
      },
    );

    // Find and return the updated user
    const updatedUser = await this.UserRepository.findOneBy({
      id: userObj.id,
      organization_id: userObj.organization_id,
    });
    if (!updatedUser) {
      // Handle case where user is not found after update
      throw new Error('User not found after update');
    }
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.UserRepository.find();
  }

  async findByUsername(organization_id: number, str: string): Promise<User> {
    try {
      const siteContracts = await this.UserRepository.createQueryBuilder('usr')
        .select([
          'usr.id AS id',
          'usr.image AS image',
          'usr.email AS email',
          'usr.name AS name',
          'usr.is_admin AS is_admin',
          'usr.password AS password',
          'usr.sub_organization_id AS sub_organization_id',
          'usr.contact_no AS contact_no',
          'usr.address AS address',
          'usr.reports_to AS reports_to',
          'rp.role_name AS role_name',
          'rp.role_permissions AS role_permissions',
        ])
        .innerJoin('role_permissions', 'rp', 'rp.id = usr.role_id')
        .where('usr.organization_id = :organizationId', {
          organizationId: organization_id,
        })
        .andWhere(
          'usr.name LIKE :str OR usr.email LIKE :str OR usr.contact_no LIKE :str',
          { str: `%${str}%` },
        )
        .getRawOne();
      return siteContracts;
    } catch (err) {
      console.error(err);
    }
  }

  async findByOrganizationId(organization_id: number) {
    return this.UserRepository.find({
      where: { organization_id },
      relations: ['role'],
      order: { name: 'ASC' }

    });
  }
}
