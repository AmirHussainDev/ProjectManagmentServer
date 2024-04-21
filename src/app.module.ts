import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { OrganizationModule } from './organization/organization.module';
import { Organization, SubOrganization, Vendor, VendorItem } from './organization/organization.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { SiteController } from './site/site.controller';
import { SiteModule } from './site/site.module';
import { SiteService } from './site/site.service';
import { SiteContracts, Site } from './site/site.entity';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolePermissions } from './role-permissions/role-permissions.entity';
import { InventoryPurchaseModule } from './inventory-purchase/inventory-purchase.module';
import { InventoryItem, PurchaseItems, PurchaseRequest, SaleItems, SaleRequest } from './inventory-purchase/inventory-purchase.entity';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        User,
        Organization,
        SubOrganization,
        Site,
        RolePermissions,
        Vendor,
        VendorItem,
        PurchaseRequest,
        PurchaseItems,
        SaleRequest,
        SaleItems,
        InventoryItem,
        SiteContracts
      ],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'Veins-Login-Secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    SiteModule,
    OrganizationModule,
    InventoryPurchaseModule,
    AuthModule,
    RolePermissionsModule,
    InventoryPurchaseModule,
  ],
  controllers: [AppController, SiteController],
  providers: [AppService, UserService, AuthService, SiteService],
  exports: [UserModule]
})
export class AppModule { }
