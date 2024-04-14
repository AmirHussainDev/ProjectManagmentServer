import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/role-permissions')
export class RolePermissionController {
    constructor(private readonly RolePermissionService: RolePermissionsService) { }


    @UseGuards(AuthGuard('jwt'))
    @Post()
    createRolePermission(@Body() { organization_id, role_name, role_permissions }: { organization_id, role_name, role_permissions }) {
        return this.RolePermissionService.createRolePermissions(organization_id, role_name, role_permissions);
    }


    @UseGuards(AuthGuard('jwt'))
    @Put()
    updateRole(@Body() body) {
        return this.RolePermissionService.updateRole(body);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllRolePermissions() {
        return this.RolePermissionService.getAllRolePermissions();
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get('roles/:orgId')
    getAllOrganizationRoles(@Param('orgId') orgId: string) {
        return this.RolePermissionService.rolesByOrganizationId(parseInt(orgId));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':orgId')
    getAllOrganizationRolePermissions(@Param('orgId') orgId: string) {
        return this.RolePermissionService.findByOrganizationId(parseInt(orgId));
    }
}
