import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { OrganizationModule } from './organization/organization.module';
import {
  Organization,
  SubOrganization,
  Vendor,
  VendorItem,
} from './organization/organization.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { SiteController } from './site/site.controller';
import { SiteModule } from './site/site.module';
import { SiteService } from './site/site.service';
import {
  SiteContracts,
  Site,
  SiteOwnerPayments,
  SiteExpenses,
  SiteContractPayments,
  SiteContractorWorkLog,
  SiteContractorPayments,
} from './site/site.entity';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolePermissions } from './role-permissions/role-permissions.entity';
import { InventoryPurchaseModule } from './inventory-purchase/inventory-purchase.module';
import {
  InventoryItem,
  PurchaseItems,
  PurchaseRequest,
  SaleItems,
  SaleRequest,
} from './inventory-purchase/inventory-purchase.entity';
import { EmployeeModule } from './employee/employee.module';
import {
  Attendance,
  Employee,
  EmployeePayments,
} from './employee/employee.entity';
import { Customer } from './customer/customer.entity';
import { CustomerModule } from './customer/customer.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P@kistan5444004',
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
        SiteContracts,
        SiteExpenses,
        SiteOwnerPayments,
        SiteContractPayments,
        SiteContractorPayments,
        SiteContractorWorkLog,
        Employee,
        Attendance,
        EmployeePayments,
        Customer,
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
    EmployeeModule,
    CustomerModule,
  ],
  controllers: [AppController, SiteController],
  providers: [AppService, UserService, AuthService, SiteService],
  exports: [UserModule],
})
export class AppModule {}
