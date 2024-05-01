import { Injectable } from '@nestjs/common';
import { Employee } from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { where } from 'sequelize';

@Injectable()
export class EmployeeService {

    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) { }


    async createEmployee(userObj: any): Promise<Employee> {
        const Employee = this.employeeRepository.create({ ...userObj });
        return this.employeeRepository.save(Employee) as any;
    }
    async updateEmployee(userObj: any): Promise<Employee> {
        // Update the user
        await this.employeeRepository.update({ id: userObj.id}, { ...userObj });

        // Find and return the updated user
        const updatedEmployee = await this.employeeRepository.findOneBy({ id: userObj.id });
        if (!updatedEmployee) {
            // Handle case where user is not found after update
            throw new Error("Employee not found after update");
        }
        return updatedEmployee;
    }

    // async getAllEmployees(organization, subOrganization): Promise<Employee[]> {
    //     return this.employeeRepository.find({
    //         where: {
    //             organization: { id: organization },
    //             subOrganization: { id: subOrganization }
    //         },
    //         relations: ['created_by', 'organization', 'subOrganization'],
    //         select: ["id", "position", "salary", "employee.supervisor","employee","overtime","siginout_required","date_created"] 
    //     });
    // }

    async getAllEmployees(organizationId: number, subOrganizationId: number) {
        console.log('here')
         const siteContracts = await this.employeeRepository
         .createQueryBuilder('em')
         .select('em.id', 'id')
         .addSelect('em.position', 'position')
         .addSelect('em.employee_id', 'employee')
         .addSelect('em.supervisor_id', 'supervisor')
         .addSelect('em.salary', 'salary')
         .addSelect('em.overtime', 'overtime')
         .addSelect('em.siginout_required', 'siginout_required')
         .where('em.organization_id = :organizationId', { organizationId })
         .andWhere('em.sub_organization_id = :subOrganizationId', { subOrganizationId })
         .getRawMany();
 
         return siteContracts;
     }

}
