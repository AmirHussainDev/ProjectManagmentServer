import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createUser(@Body() body) {
    return this.userService.createUser(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('password')
  changePassword(@Body() body) {
    return this.userService.changePassword(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateUser(@Body() body) {
    return this.userService.updateUser(body);
  }

  @UseGuards(AuthGuard('local'))
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':orgId')
  getAllOrganizationUsers(@Param('orgId') orgId: string) {
    return this.userService.findByOrganizationId(parseInt(orgId));
  }
}
