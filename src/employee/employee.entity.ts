import {
  Organization,
  SubOrganization,
} from 'src/organization/organization.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  position: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => SubOrganization)
  @JoinColumn({ name: 'sub_organization_id' })
  subOrganization: SubOrganization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: User;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  salary: number;

  @Column()
  overtime: boolean;

  @Column({ nullable: true })
  isSalaryHourly: boolean;

  @Column({ nullable: true })
  workingHours: number;

  @Column({ nullable: true })
  siginout_required: boolean;

  @Column({ nullable: true })
  deleted: boolean;

  @Column({ nullable: true })
  details: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'timestamp' })
  sign_in: Date;

  @Column({ nullable: true, type: 'timestamp' })
  sign_out: Date;

  @Column({ nullable: true })
  sign_in_corrd: string;

  @Column({ nullable: true })
  sign_out_corrd: string;

  @Column({ nullable: true })
  hours_worked: number;

  @Column({ nullable: true })
  approved_hours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  amount: number;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  attendance_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;
}

@Entity()
export class EmployeePayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment_type: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  balance: number;

  @Column({ nullable: true })
  payment_notes: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => SubOrganization)
  @JoinColumn({ name: 'sub_organization_id' })
  subOrganization: SubOrganization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;
}
