import { Customer } from 'src/customer/customer.entity';
import {
  Organization,
  SubOrganization,
  Vendor,
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
export class PurchaseRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  isSiteBased: boolean;

  @Column({ nullable: true })
  site_ids: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => SubOrganization)
  @JoinColumn({ name: 'sub_organization_id' })
  subOrganization: SubOrganization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ nullable: true })
  notes: string;

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
  subject: string;

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
  @Column({ nullable: true })
  sales_person: number;
  @Column({ nullable: true })
  attachment: string;
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
  purchase_no: number;
}

@Entity()
export class PurchaseItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseRequest)
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseRequest;

  @Column()
  name: string;

  @Column()
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

  @ManyToOne(() => SubOrganization)
  @JoinColumn({ name: 'sub_organization_id' })
  subOrganization: SubOrganization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ nullable: true })
  notes: string;

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
  subject: string;

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

  @Column({ nullable: true })
  attachment: string;
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

  @Column({ nullable: true })
  @ManyToOne(() => Vendor)
  vendor_id: number;

  @Column()
  name: string;

  @Column()
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
  @ManyToOne(() => SubOrganization)
  sub_organization_id: number;

  @Column({ nullable: true })
  isSiteBased: boolean;

  @Column({ nullable: true })
  site_ids: string;

  @Column({ nullable: true })
  @ManyToOne(() => PurchaseRequest)
  purchase_id: number;

  @Column({ nullable: true })
  @ManyToOne(() => SaleRequest)
  sale_id: number;

  @Column({ nullable: true })
  purchase_no: number;

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

  @Column({ nullable: true })
  @ManyToOne(() => Vendor)
  vendor_id: number;

  @Column()
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
