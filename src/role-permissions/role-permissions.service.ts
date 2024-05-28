import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissions } from './role-permissions.entity';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermissions)
    private readonly RolePermissionsRepository: Repository<RolePermissions>,
  ) {}

  async createRolePermissions(
    organization_id: number,
    role_name,
    role_permissions,
  ): Promise<RolePermissions> {
    const RolePermissions = this.RolePermissionsRepository.create({
      organization_id,
      role_name,
      role_permissions,
    });
    return this.RolePermissionsRepository.save(RolePermissions);
  }
  async updateRole(userObj: any): Promise<RolePermissions> {
    // Update the user
    await this.RolePermissionsRepository.update(
      { id: userObj.id },
      {
        role_name: userObj.role_name,
        role_permissions: userObj.role_permissions,
      },
    );

    // Find and return the updated user
    const updatedUser = await this.RolePermissionsRepository.findOneBy({
      id: userObj.id,
    });
    if (!updatedUser) {
      // Handle case where user is not found after update
      throw new Error('User not found after update');
    }

    return updatedUser;
  }
  async getAllRolePermissions(): Promise<RolePermissions[]> {
    return this.RolePermissionsRepository.find();
  }

  async findByOrganizationId(
    organization_id: number,
  ): Promise<RolePermissions[]> {
    return this.RolePermissionsRepository.find({
      where: { organization_id },
      order: { role_name: 'asc' },
    });
  }

  async rolesByOrganizationId(
    organization_id: number,
  ): Promise<RolePermissions[]> {
    return this.RolePermissionsRepository.find({
      where: { organization_id },
      select: ['id', 'role_name'],
    });
  }
}
