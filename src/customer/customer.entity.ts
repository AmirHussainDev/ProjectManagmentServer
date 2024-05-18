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
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

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

  @Column('text', { nullable: true })
  contact_no: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('text', { nullable: true })
  account_no: string;
}
