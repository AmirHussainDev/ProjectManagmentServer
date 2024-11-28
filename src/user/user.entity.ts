import {
  Organization,
  Client,
} from 'src/organization/organization.entity';
import { RolePermissions } from 'src/role-permissions/role-permissions.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  organization_id: number;
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  client_id: number;
  @ManyToOne(() => Client)
  client: Client;

  @Column('text', { nullable: true })
  password: string;

  @Column('text', { nullable: true })
  email: string;

  @Column('text', { unique: true, nullable: true })
  contact_no: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  image: string;

  @Column('text', { nullable: true })
  reports_to: number;

  @Column('boolean', { nullable: true })
  is_admin: boolean;

  @Column('boolean', { nullable: true })
  is_client: boolean;

  @Column('boolean', { nullable: true })
  is_employee: boolean;

  @Column('boolean', { nullable: true })
  deleted: boolean;

  @ManyToOne(() => RolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RolePermissions;
}
