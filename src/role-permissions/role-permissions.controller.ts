import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';

@Controller('api/role-permissions')
export class RolePermissionController {
    constructor(private readonly RolePermissionService: RolePermissionsService) { }

    @Post()
    createRolePermission(@Body() { organization_id, role_name, role_permissions }: { organization_id, role_name, role_permissions }) {
       console.log( organization_id, role_name, role_permissions )
        return this.RolePermissionService.createRolePermissions(organization_id, role_name, role_permissions);
    }


    @Put()
    updateRole(@Body() body) {
        return this.RolePermissionService.updateRole(body);
    }


    @Get()
    getAllRolePermissions() {
        return this.RolePermissionService.getAllRolePermissions();
    }

    
    @Get('roles/:orgId')
    getAllOrganizationRoles(@Param('orgId') orgId: string) {
        return this.RolePermissionService.rolesByOrganizationId(parseInt(orgId));
    }
    @Get(':orgId')
    getAllOrganizationRolePermissions(@Param('orgId') orgId: string) {
        return this.RolePermissionService.findByOrganizationId(parseInt(orgId));
    }
}
