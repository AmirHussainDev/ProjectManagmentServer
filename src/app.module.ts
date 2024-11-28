import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { OrganizationModule } from './organization/organization.module';
import {
  Organization,
  Client,
  Project,
  ProjectItem,
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
  TaskWorkLog,
  SiteContractorPayments,
} from './site/site.entity';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { RolePermissions } from './role-permissions/role-permissions.entity';
import { InventoryTaskModule } from './task/task.module';
import {
  InventoryItem,
  TaskItems,
  TaskRequest,
  SaleItems,
  SaleRequest,
} from './task/task.entity';
import { EmployeeModule } from './employee/employee.module';
import {
  Worklog,
  Employee,
  EmployeePayments,
  ClientPayments,
} from './employee/employee.entity';
import { Customer } from './customer/customer.entity';
import { CustomerModule } from './customer/customer.module';
import { Currency } from './currency/currency.entity';
import { CurrencyModule } from './currency/currency.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'project_management',
      entities: [
        User,
        Organization,
        Client,
        Site,
        RolePermissions,
        Project,
        ProjectItem,
        TaskRequest,
        TaskItems,
        SaleRequest,
        SaleItems,
        InventoryItem,
        SiteContracts,
        SiteExpenses,
        SiteOwnerPayments,
        SiteContractPayments,
        SiteContractorPayments,
        TaskWorkLog,
        Employee,
        Worklog,
        EmployeePayments,
        ClientPayments,
        Customer,
        Currency,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'Eleware-Login-Secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    SiteModule,
    OrganizationModule,
    InventoryTaskModule,
    AuthModule,
    RolePermissionsModule,
    InventoryTaskModule,
    EmployeeModule,
    CustomerModule,
    CurrencyModule,
  ],
  controllers: [AppController, SiteController],
  providers: [AppService, UserService, AuthService, SiteService],
  exports: [UserModule],
})
export class AppModule {}
