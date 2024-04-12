import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/Users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    createUser(@Body() body) {
        return this.userService.createUser(body);
    }

    @Put()
    updateUser(@Body() body) {
        return this.userService.updateUser(body);
    }

    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':orgId')
    getAllOrganizationUsers(@Param('orgId') orgId: string) {
        return this.userService.findByOrganizationId(parseInt(orgId));
    }

}
