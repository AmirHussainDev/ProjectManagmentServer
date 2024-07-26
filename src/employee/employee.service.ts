import { Injectable } from '@nestjs/common';
import { Attendance, Employee, EmployeePayments } from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { where } from 'sequelize';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(EmployeePayments)
    private readonly employeePaymentsRepository: Repository<EmployeePayments>,
  ) {}

  async createEmployee(userObj: any): Promise<Employee> {
    const Employee = this.employeeRepository.create({ ...userObj });
    return this.employeeRepository.save(Employee) as any;
  }
  async updateEmployee(userObj: any): Promise<Employee> {
    // Update the user
    await this.employeeRepository.update({ id: userObj.id }, { ...userObj });

    // Find and return the updated user
    const updatedEmployee = await this.employeeRepository.findOneBy({
      id: userObj.id,
    });
    if (!updatedEmployee) {
      // Handle case where user is not found after update
      throw new Error('Employee not found after update');
    }
    return updatedEmployee;
  }

  async getUserEmployeeDetails(
    organizationId: number,
    subOrganizationId: number,
    userId: number,
  ) {
    return await this.employeeRepository.findOne({
      where: {
        organization: { id: organizationId },
        subOrganization: { id: subOrganizationId },
        employee: { id: userId },
      },
      relations: ['employee', 'supervisor'],
    });
  }

  async getCurrentEmployeeSubordinates(
    organizationId: number,
    subOrganizationId: number,
    userId: number,
  ) {
    return await this.employeeRepository.find({
      where: {
        organization: { id: organizationId },
        subOrganization: { id: subOrganizationId },
        supervisor: { id: userId },
        employee: { id: Not(userId) },
      },
      relations: ['employee', 'supervisor'],
    });
  }

  async getAllEmployees(organizationId: number, subOrganizationId: number) {
    // console.log('here')
    const siteContracts = await this.employeeRepository
      .createQueryBuilder('em')
      .leftJoin('em.employee', 'emp')
      .leftJoin('em.supervisor', 'sup')
      .select('em.id', 'id')
      .addSelect('emp.name', 'employeeName')
      .addSelect('sup.name', 'supervisorName')
      .addSelect('em.position', 'position')
      .addSelect('em.employee_id', 'employee')
      .addSelect('em.supervisor_id', 'supervisor')
      .addSelect('em.salary', 'salary')
      .addSelect('em.overtime', 'overtime')
      .addSelect('em.workingHours', 'workingHours')
      .addSelect('em.isSalaryHourly', 'isSalaryHourly')
      .addSelect('em.details', 'details')
      .addSelect('em.siginout_required', 'siginout_required')
      .where('em.organization_id = :organizationId', { organizationId })
      .andWhere('em.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .getRawMany();

    return siteContracts;
  }

  async createAttendance(userObj: any): Promise<Attendance> {
    const Employee = this.attendanceRepository.create({ ...userObj });
    return this.attendanceRepository.save(Employee) as any;
  }
  async updateAttendance(userObj: any): Promise<Attendance> {
    // Update the user
    await this.attendanceRepository.update({ id: userObj.id }, { ...userObj });

    // Find and return the updated user
    const updatedEmployee = await this.attendanceRepository.findOneBy({
      id: userObj.id,
    });
    if (!updatedEmployee) {
      // Handle case where user is not found after update
      throw new Error('Employee not found after update');
    }
    return updatedEmployee;
  }

  async getAllAttendance(
    organizationId: number,
    subOrganizationId: number,
    employeeId: number,
  ) {
    const siteContracts = await this.attendanceRepository
      .createQueryBuilder('em')
      .select('em.id', 'id')
      .addSelect('em.position', 'position')
      .addSelect('em.employee_id', 'employee')
      .addSelect('em.supervisor_id', 'supervisor')
      .addSelect('em.salary', 'salary')
      .addSelect('em.overtime', 'overtime')
      .addSelect('em.siginout_required', 'siginout_required')
      .where('em.organization_id = :organizationId', { organizationId })
      .andWhere('em.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
      .getRawMany();

    return siteContracts;
  }

  async getCurrentDateAttendance(
    employeeId: number,
  ): Promise<Attendance | undefined> {
    const currentDate = new Date();
    const currentDateStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
    );
    const currentDateEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
    );

    return await this.attendanceRepository.findOne({
      where: {
        employee: { id: employeeId },
        date_created: Between(currentDateStart, currentDateEnd),
      },
    });
  }

  async getCurrentEmployeeAttendance(
    employeeId: number,
  ): Promise<{ lastPayment: EmployeePayments; attendances: Attendance[] }> {
    let attendances: Attendance[];

    // Check if there's any payment record for the employee
    const lastPayment = await this.employeePaymentsRepository.findOne({
      where: { employee: { id: employeeId } },
      order: { date_created: 'DESC' },
    });

    if (lastPayment) {
      // Case 1: If payment record found, retrieve attendance after the last payment

      attendances = await this.attendanceRepository.find({
        where: {
          employee: { id: employeeId },
          date_created: MoreThanOrEqual(lastPayment.date_created),
        },
      });
    } else {
      // Case 2: If no payment record found, retrieve all attendance for the employee
      attendances = await this.attendanceRepository.find({
        where: { employee: { id: employeeId } },
      });
    }

    return { lastPayment, attendances };
  }

  async createPayments(userObj: any): Promise<EmployeePayments> {
    const Employee = this.employeePaymentsRepository.create({ ...userObj });
    return this.employeePaymentsRepository.save(Employee) as any;
  }

  async getAllEmployeePayments(
    organizationId: number,
    subOrganizationId: number,
    employeeId: number,
  ) {
    const payments = await this.employeePaymentsRepository.find({
      where: {
        organization: { id: organizationId },
        subOrganization: { id: subOrganizationId },
        employee: { id: employeeId },
      },
      order: { date_created: 'DESC' },
    });

    return payments;
  }
  async getAllEmployeeDuePayments(
    organizationId: number,
    subOrganizationId: number,
  ) {
    const paymentArray = [];

    try {
      const employees = await this.employeeRepository.find({
        where: {
          organization: { id: organizationId },
          subOrganization: { id: subOrganizationId },
        },
        relations: ['employee', 'supervisor'],
        order: { date_created: 'DESC' },
      });

      for (let i = 0; i < employees.length; i++) {
        const employeeId = employees[i].id;
        const lastPayment = await this.employeePaymentsRepository.findOne({
          where: { employee: { id: employeeId } },
          order: { date_created: 'DESC' },
        });

        const paymentObject = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .select('SUM(attendance.amount)', 'totalAmount')
          .addSelect('MIN(attendance.date_created)', 'minDateCreated')
          .where('attendance.employee.id = :employeeId', {
            employeeId: employeeId,
          })
          .andWhere('attendance.date_created >= :lastPaymentDate', {
            lastPaymentDate: lastPayment
              ? lastPayment.date_created
              : employees[i].date_created,
          })
          .getRawOne();

        paymentObject.balance = lastPayment?.balance || 0;
        paymentArray.push({ employee: employees[i], paymentObject });
      }
    } catch (err) {
      console.error(err);
    } finally {
      return paymentArray;
    }
  }
}
