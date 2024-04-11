import { Module } from "@nestjs/common";
import { RolePermissionController } from "./role-permissions.controller";
import { RolePermissionsService } from "./role-permissions.service";
import { RolePermissions } from "./role-permissions.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([RolePermissions]),
    ],
    providers: [RolePermissionsService],
    controllers: [RolePermissionController],
    exports:[
        TypeOrmModule.forFeature([RolePermissions])
    ]
})
export class RolePermissionsModule { }