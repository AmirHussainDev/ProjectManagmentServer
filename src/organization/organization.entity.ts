import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  domain_name: string;

  @Column()
  icon: string;

  @Column()
  image: string;
}

@Entity()
export class SubOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  filename: string;

  @Column()
  organization_id: number;
}

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  filename: string;

  @Column()
  organization_id: number;
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column({ nullable: true })
  contact_no: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;
}

@Entity()
export class VendorItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @ManyToOne(() => Vendor)
  vendor_id: number;
}
