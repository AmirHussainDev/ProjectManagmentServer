import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Employee } from 'src/employee/employee.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async createUser(userObj: any): Promise<User> {
    const hash = bcrypt.hashSync(userObj.password, 10);
    const User = this.UserRepository.create({ ...userObj, password: hash });
    const user = (await this.UserRepository.save(User)) as any;

    if (userObj.is_employee) {
      const Employee = this.employeeRepository.create({
        // position: 'employee',
        employee: user.id,
        organization: user.organization_id,
        subOrganization: user.sub_organization_id,
        supervisor: user.reports_to,
        salary: 0,
        overtime: false,
        isSalaryHourly: false,
        workingHours: 8,
        siginout_required: false,
        details: '',
        created_by: user.created_by_id,
      });
      await this.employeeRepository.save(Employee);
    }
    return user;
  }
  async changePassword(userObj: any): Promise<boolean> {
    const hash = bcrypt.hashSync(userObj.password, 10);
    await this.UserRepository.update(
      { id: userObj.id, organization_id: userObj.organization_id },
      {
        password: hash,
      },
    );
    return true;
  }
  async updateUser(userObj: any): Promise<User> {
    // Update the user
    const previousUser: User = await this.UserRepository.findOneBy({
      id: userObj.id,
    });
    await this.UserRepository.update(
      { id: userObj.id, organization_id: userObj.organization_id },
      {
        ...userObj,
        reports_to: userObj.reports_to,
      },
    );

    if (previousUser.sub_organization_id !== userObj.sub_organization_id) {
      if (userObj.deleted) {
        this.employeeRepository.update(
          { employee: userObj.id },
          {
            deleted: userObj.deleted,
          },
        );
      } else {
        this.employeeRepository.update(
          { employee: userObj.id },
          {
            subOrganization: userObj.sub_organization_id,
          },
        );
      }
    }

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
      const user = await this.UserRepository.createQueryBuilder('usr')
        .select([
          'usr.id AS id',
          'usr.image AS image',
          'usr.email AS email',
          'usr.name AS name',
          'usr.is_admin AS is_admin',
          'usr.password AS password',
          'usr.deleted AS deleted',
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
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async findByOrganizationId(organization_id: number) {
    return this.UserRepository.find({
      where: { organization_id },
      relations: ['role'],
      order: { name: 'ASC' },
    });
  }
}
