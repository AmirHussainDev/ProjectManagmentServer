import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly UserRepository: Repository<User>,
    ) { }

    async createUser(userObj: any): Promise<User> {
        const hash = bcrypt.hashSync(userObj.password, 10);
        const User = this.UserRepository.create({ ...userObj, password: hash });
        return this.UserRepository.save(User) as any;
    }
    async updateUser(userObj: any): Promise<User> {
        // Update the user
        await this.UserRepository.update({ id: userObj.id,organization_id:userObj.organization_id }, { role_id: userObj.role_id, reports_to: userObj.reports_to, name:userObj.name });
    
        // Find and return the updated user
        const updatedUser = await this.UserRepository.findOneBy({ id: userObj.id,organization_id:userObj.organization_id });
        if (!updatedUser) {
            // Handle case where user is not found after update
            throw new Error("User not found after update");
        }
        return updatedUser;
    }

    async getAllUsers(): Promise<User[]> {
        return this.UserRepository.find();
    }
    

    async findByUsername(organization_id: number, name: string): Promise<User> {
        return this.UserRepository.findOneBy({ organization_id, name });
    }

    async findByOrganizationId(organization_id: number) {
        return this.UserRepository.findBy({ organization_id });
    }

}

