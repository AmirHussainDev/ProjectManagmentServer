import { Organization, Client } from 'src/organization/organization.entity';
import { TaskRequest } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  site_no: number;

  @Column({ nullable: true })
  site_supervisors: string;

  @Column()
  name: string;
  @Column()
  budget: string;
  @Column()
  owner: string;
  @Column()
  contact_no: string;

  @Column()
  address: string;
  @Column({ nullable: true })
  details: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column()
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  site_start_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  site_end_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}

@Entity()
export class SiteExpenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  is_general: boolean;

  @Column({ nullable: true })
  task_id: number;

  @Column()
  is_paid: boolean;

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
  unit_price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  refered_by: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;
}

@Entity()
export class SiteOwnerPayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: string;

  @Column()
  is_paid: boolean;

  @Column()
  note: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;
}

@Entity()
export class SiteContracts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column('jsonb', { nullable: true })
  attachment: any;

  @Column({ nullable: true })
  terms: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column()
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column()
  contractor: string;

  @Column()
  title: string;

  @Column()
  contract_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  contract_start_date: Date;

  @Column({ type: 'timestamp' })
  contract_end_date: Date;

  @Column()
  with_material: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    nullable: true,
  })
  amount_per_unit: number;

  @Column({ nullable: true })
  no_of_hours: number;

  @Column({ nullable: true })
  include_weekends: boolean;

  @Column({ nullable: true })
  details: string;
}

@Entity()
export class SiteContractPayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @Column()
  is_paid: boolean;

  @Column()
  note: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne((type) => SiteContracts)
  @JoinColumn({ name: 'contract_id' })
  contract: SiteContracts;
}

@Entity()
export class TaskWorkLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  work_from: Date;

  @Column()
  no_of_hours: number;

  @Column({ nullable: true })
  approved_hours: number;

  @Column()
  note: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => TaskRequest)
  @JoinColumn({ name: 'task_id' })
  task: TaskRequest;

  @Column({ default: false })
  paid: boolean;

}

@Entity()
export class SiteContractorPayments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @Column({ nullable: true, default: false })
  is_paid: boolean;

  @Column()
  note: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne((type) => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne((type) => Site)
  @JoinColumn({ name: 'site_id' })
  site: Site;

  @ManyToOne((type) => SiteContracts)
  @JoinColumn({ name: 'contract_id' })
  contract: SiteContracts;
}
