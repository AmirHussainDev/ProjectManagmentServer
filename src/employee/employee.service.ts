import { Injectable } from '@nestjs/common';
import { Worklog, Employee, EmployeePayments } from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { TaskWorkLog } from 'src/site/site.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Worklog)
    private readonly worklogRepository: Repository<Worklog>,
    @InjectRepository(EmployeePayments)
    private readonly employeePaymentsRepository: Repository<EmployeePayments>,
    @InjectRepository(TaskWorkLog)
    private readonly taskWorkLogRepository: Repository<TaskWorkLog>,
  ) { }

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
    clientId: number,
    userId: number,
  ) {
    return await this.employeeRepository.findOne({
      where: {
        organization: { id: organizationId },
        client: { id: clientId },
        employee: { id: userId },
      },
      relations: ['employee'],
    });
  }

  async getCurrentEmployeeSubordinates(
    organizationId: number,
    clientId: number,
    userId: number,
  ) {
    const user = await this.userRepository.findBy({ id: userId });
    console.log(user, user[0].is_admin);
    const resp = user[0].is_admin
      ? await this.employeeRepository.find({
        where: {
          organization: { id: organizationId },
          client: { id: clientId },
          employee: { id: Not(userId) },
        },
        relations: ['employee'],
      })
      : await this.employeeRepository.find({
        where: {
          organization: { id: organizationId },
          client: { id: clientId },
          employee: { id: Not(userId) },
        },
        relations: ['employee'],
      });
    return resp;
  }

  async getAllEmployees(organizationId: number, clientId: number) {
    // console.log('here')
    const siteContracts = await this.employeeRepository
      .createQueryBuilder('em')
      .leftJoin('em.employee', 'emp')
      .select('em.id', 'id')
      .addSelect('emp.name', 'employeeName')
      .addSelect('em.position', 'position')
      .addSelect('em.employee_id', 'employee')
      .addSelect('em.salary', 'salary')
      .addSelect('em.overtime', 'overtime')
      .addSelect('em.workingHours', 'workingHours')
      .addSelect('em.isHourlyRateHourly', 'isHourlyRateHourly')
      .addSelect('em.details', 'details')
      .addSelect('em.siginout_required', 'siginout_required')
      .where('em.organization_id = :organizationId', { organizationId })
      .andWhere('em.client_id = :clientId', {
        clientId,
      })
      .getRawMany();

    return siteContracts;
  }

  async createWorklog(userObj: any): Promise<TaskWorkLog> {
    const Employee = this.taskWorkLogRepository.create({ ...userObj });
    return this.worklogRepository.save(Employee) as any;
  }

  async payEmployeeWorklog(clientId: number, userId: number): Promise<boolean> {
    // Update the user
    await this.taskWorkLogRepository.update(
      { created_by: { id: userId }, client: { id: clientId } },
      { paid: true },
    );

    return true;
  }
  async updateWorklog(userObj: any): Promise<TaskWorkLog> {
    // Update the user
    await this.taskWorkLogRepository.update({ id: userObj.id }, { ...userObj });

    // Find and return the updated user
    const updatedEmployee = await this.taskWorkLogRepository.findOneBy({
      id: userObj.id,
    });
    if (!updatedEmployee) {
      // Handle case where user is not found after update
      throw new Error('Employee not found after update');
    }
    return updatedEmployee;
  }

  async getAllWorklog(
    organizationId: number,
    clientId: number,
    employeeId: number,
  ) {
    const siteContracts = await this.worklogRepository
      .createQueryBuilder('em')
      .select('em.id', 'id')
      // .addSelect('em.position', 'position')
      .addSelect('em.employee_id', 'employee')
      .addSelect('em.supervisor_id', 'supervisor')
      .addSelect('em.salary', 'salary')
      .addSelect('em.overtime', 'overtime')
      .addSelect('em.siginout_required', 'siginout_required')
      .where('em.organization_id = :organizationId', { organizationId })
      .andWhere('em.client_id = :clientId', {
        clientId,
      })
      .getRawMany();

    return siteContracts;
  }

  async getCurrentDateWorklog(
    employeeId: number,
  ): Promise<Worklog | undefined> {
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

    return await this.worklogRepository.findOne({
      where: {
        employee: { id: employeeId },
        date_created: Between(currentDateStart, currentDateEnd),
      },
    });
  }

  async getcurrentEmployeeWorkLog(
    employeeId: number,
    clientId: number,
  ): Promise<any[]> {
    return await this.taskWorkLogRepository.find({
      where: { created_by: { id: employeeId }, client: { id: clientId } },
      order: { date_created: 'DESC' },
      relations: ['task'],
    });
  }

  async createPayments(userObj: any): Promise<EmployeePayments> {
    const Employee = this.employeePaymentsRepository.create({ ...userObj });
    return this.employeePaymentsRepository.save(Employee) as any;
  }

  async getAllEmployeePayments(
    organizationId: number,
    clientId: number,
    employeeId: number,
  ) {
    const payments = await this.employeePaymentsRepository.find({
      where: {
        organization: { id: organizationId },
        client: { id: clientId },
        employee: { id: employeeId },
      },
      order: { date_created: 'DESC' },
    });

    return payments;
  }

  async getAllEmployeeDuePayments(organizationId: number, clientId: number) {
    const paymentArray = [];

    try {
      const employees = await this.employeeRepository.find({
        where: {
          organization: { id: organizationId },
          client: { id: clientId },
        },
        relations: ['employee'],
        order: { date_created: 'DESC' },
      });

      for (let i = 0; i < employees.length; i++) {
        const employeeId = employees[i].employee.id;
        const worklog = await this.getcurrentEmployeeWorkLog(
          employeeId,
          clientId,
        );
        // Calculate total worked hours and remaining unpaid hours
        const totalWorkedHours = worklog.reduce(
          (total, log) => total + log.no_of_hours,
          0,
        );

        const remainingUnpaidHours = worklog
          .filter((log) => !log.paid) // Filter unpaid worklogs
          .reduce((total, log) => total + log.no_of_hours, 0);
        const paymentObject = {
          totalAmount: totalWorkedHours * employees[i].salary,
          balance: remainingUnpaidHours * employees[i].salary,
        };
        paymentArray.push({ employee: employees[i], worklog, paymentObject });
      }
    } catch (err) {
      console.error(err);
    } finally {
      return paymentArray;
    }
  }
}
