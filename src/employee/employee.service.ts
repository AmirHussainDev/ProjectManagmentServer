import { Injectable } from '@nestjs/common';
import {
  Worklog,
  Employee,
  EmployeePayments,
  ClientPayments,
} from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { TaskWorkLog } from 'src/site/site.entity';
import { Client } from 'src/organization/organization.entity';

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
    @InjectRepository(ClientPayments)
    private readonly clientPaymentsRepository: Repository<ClientPayments>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
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

  async createClientPayments(userObj: any): Promise<ClientPayments> {
    const clientPayment = this.clientPaymentsRepository.create({ ...userObj });
    return this.clientPaymentsRepository.save(clientPayment) as any;
  }

  async getClientExpenseSummary(
    client_id: number,
  ): Promise<{ expense: string }> {
    let totalExpense = 0;

    // Fetch fixed-rate employee payments filtered by client_id
    const employeePayments = await this.employeePaymentsRepository.find({
      where: { client: { id: client_id } },
    });

    // Sum up fixed-rate employee payments
    totalExpense += employeePayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount.toString()),
      0,
    );

    // Fetch employees associated with the client
    const employees = await this.employeeRepository.find({
      where: { client: { id: client_id } },
      relations: ['employee'],
    });

    // Calculate expenses for hourly-rated employees
    for (const employee of employees) {
      if (employee.isHourlyRateHourly) {
        const worklogs = await this.getcurrentEmployeeWorkLog(
          employee.employee.id,
          client_id,
        );
        const totalHours = worklogs.reduce(
          (sum, log) => sum + log.no_of_hours,
          0,
        );
        totalExpense += totalHours * employee.salary; // Hourly rate multiplied by total hours worked
      }
    }

    // Return the total expense with two decimal precision
    return {
      expense: totalExpense.toFixed(2),
    };
  }

  async getClientExpenseGroupedByClientId(): Promise<
    {
      id: number;
      name: string;
      currency: string;
      budget: string;
      expense: string;
    }[]
  > {
    // Fetch all clients
    const allClients = await this.clientRepository.find();

    // Fetch all employee payments with related client details
    const employeePayments = await this.employeePaymentsRepository.find({
      relations: ['client', 'employee'], // Include the `employee` relation
    });

    // Fetch all employees to identify hourly-rated employees
    const employees = await this.employeeRepository.find({
      relations: ['client', 'employee'],
    });

    // Map hourly-rated employees by client
    const hourlyExpensesByClient = {};

    for (const employee of employees) {
      if (employee.isHourlyRateHourly) {
        const worklogs = await this.getcurrentEmployeeWorkLog(
          employee.employee.id,
          employee.client.id,
        );
        const totalHours = worklogs.reduce(
          (sum, log) => sum + log.no_of_hours,
          0,
        );
        const totalHourlyExpense = totalHours * employee.salary; // Calculate expense

        const clientId = employee.client.id;
        if (!hourlyExpensesByClient[clientId]) {
          hourlyExpensesByClient[clientId] = 0;
        }
        hourlyExpensesByClient[clientId] += totalHourlyExpense;
      }
    }

    // Group fixed-rate employee payments by client and calculate total expense
    const expenseByClient = employeePayments.reduce((acc, payment) => {
      const client = payment.client;
      const clientId = client.id;

      if (!acc[clientId]) {
        acc[clientId] = {
          id: clientId,
          name: client.name,
          budget: client.projectBudget || '0',
          currency: client.currency || 'USD',
          expense: 0,
        };
      }

      acc[clientId].expense += parseFloat(payment.amount.toString());
      return acc;
    }, {});

    // Combine hourly-rated and fixed-rate expenses
    for (const clientId in hourlyExpensesByClient) {
      if (!expenseByClient[clientId]) {
        const client = allClients.find((c) => c.id === parseInt(clientId));
        if (client) {
          expenseByClient[clientId] = {
            id: client.id,
            name: client.name,
            budget: client.projectBudget || '0',
            currency: client.currency || 'USD',
            expense: 0,
          };
        }
      }
      if (expenseByClient[clientId]) {
        expenseByClient[clientId].expense += hourlyExpensesByClient[clientId];
      }
    }

    // Combine all clients with their respective expenses
    const result = allClients.map((client) => {
      const clientExpense = expenseByClient[client.id] || {
        id: client.id,
        name: client.name,
        budget: client.projectBudget || '0',
        currency: client.currency || 'USD',
        expense: 0,
      };

      return {
        id: clientExpense.id,
        name: clientExpense.name,
        currency: clientExpense.currency,
        budget: clientExpense.budget,
        expense: clientExpense.expense.toFixed(2), // Precision of two decimal points
      };
    });

    return result;
  }

  async getClientBudgetDetail(client_id: number): Promise<any> {
    // Fetch all client payments
    const clientPayments = await this.clientPaymentsRepository.find({
      order: { recieving_date: 'DESC' },
      where: { client: { id: client_id } }, // Assuming the `client` field is a relation
    });

    if (!clientPayments.length) {
      return {
        summary: {
          recieved: '0',
          recieving_date: null,
        },
        details: [],
      };
    }

    // Calculate the summary
    const totalRecieved = clientPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount.toString()),
      0,
    );
    const mostRecentDate = clientPayments[0].recieving_date;

    // Prepare the details
    const details = clientPayments.map((payment) => ({
      recieved: payment.amount.toString(),
      recieving_date: payment.recieving_date,
    }));

    return {
      summary: {
        recieved: totalRecieved.toFixed(2), // Keeping precision of two decimal points
        recieving_date: mostRecentDate,
      },
      details,
    };
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

      for (const employee of employees) {
        const employeeId = employee.employee.id;

        if (employee.isHourlyRateHourly) {
          // Handle hourly rate employees
          const worklog = await this.getcurrentEmployeeWorkLog(
            employeeId,
            clientId,
          );

          const totalWorkedHours = worklog.reduce(
            (total, log) => total + log.no_of_hours,
            0,
          );

          const remainingUnpaidHours = worklog
            .filter((log) => !log.paid) // Filter unpaid worklogs
            .reduce((total, log) => total + log.no_of_hours, 0);

          const paymentObject = {
            totalAmount: totalWorkedHours * employee.salary,
            totalPaid:
              totalWorkedHours * employee.salary -
              remainingUnpaidHours * employee.salary,
            balance: remainingUnpaidHours * employee.salary,
          };

          paymentArray.push({ employee, worklog, paymentObject });
        } else {
          // Handle non-hourly rate employees
          const payments = await this.getAllEmployeePayments(
            organizationId,
            clientId,
            employee.id,
          );

          const totalPaid = payments.reduce(
            (total, payment) => total + parseFloat(payment.amount.toString()),
            0,
          );

          const paymentObject = {
            totalAmount: employee.salary, // Fixed salary
            totalPaid: totalPaid,
            balance: employee.salary - totalPaid, // Remaining balance
          };

          paymentArray.push({ employee, payments, paymentObject });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      return paymentArray;
    }
  }
}
