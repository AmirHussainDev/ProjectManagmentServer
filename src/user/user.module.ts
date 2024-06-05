import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
