import { Customer } from 'src/customer/customer.entity';
import {
  Organization,
  Client,
  Project,
} from 'src/organization/organization.entity';
import { Site } from 'src/site/site.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class TaskRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  task_no: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ nullable: true })
  description: string;

  @Column()
  state: number;
  @Column()
  type: number;
  @Column({ nullable: true })
  severity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  due_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_modified_on: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  assignee: number;
  @Column('jsonb', { nullable: true })
  attachment: any;
  @Column({ nullable: true })
  terms: string;
}

@Entity()
export class TaskItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskRequest)
  @JoinColumn({ name: 'task_id' })
  task: TaskRequest;

  @Column()
  name: string;

  @Column({ nullable: true })
  qty: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  unit_price: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  discount: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_created: Date;

  @Column({ nullable: true })
  isCustom: boolean;
}

@Entity()
export class SaleRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  item_cost: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  additional_cost: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  shipment_charges: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  amount_paid: number;
  @Column('jsonb', { nullable: true })
  payment_history: any;
  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  discount_total: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  balance: number;

  @Column()
  state: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ type: 'timestamp', nullable: true })
  balance_to_be_paid_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_confirmation_on: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_modified_on: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  overall_discount: number;
  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  invoice_date: Date;
  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  due_date: Date;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

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
  items_discount_total: number;
  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  overall_discount_total: number;

  @Column({ nullable: true })
  sale_no: number;
}

@Entity()
export class SaleItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SaleRequest)
  @JoinColumn({ name: 'sale_id' })
  sale: SaleRequest;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  name: string;

  @Column({ nullable: true })
  qty: number;

  @Column('jsonb', { nullable: true })
  return_details: any;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  unit_price: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  discount: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_created: Date;

  @Column({ nullable: true })
  isCustom: boolean;
}

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Organization)
  organization_id: number;

  @Column()
  @ManyToOne(() => Client)
  client_id: number;

  @Column({ nullable: true })
  isSiteBased: boolean;

  @Column({ nullable: true })
  site_ids: string;

  @Column({ nullable: true })
  @ManyToOne(() => TaskRequest)
  task_id: number;

  @Column({ nullable: true })
  @ManyToOne(() => SaleRequest)
  sale_id: number;

  @Column({ nullable: true })
  task_no: number;

  @Column({ nullable: true })
  sale_no: number;

  @Column({ nullable: true })
  @ManyToOne(() => Site)
  site_id: number;

  @Column({ nullable: true })
  site_no: number;

  @Column()
  stock_in: boolean;

  @Column()
  name: string;

  // @Column({ nullable: true })
  // @ManyToOne(() => Project)
  // project_id: number;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ nullable: true })
  qty: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  unit_price: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total: number;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_created: Date;
}
