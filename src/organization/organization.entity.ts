import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  projectDescription: string;

  @Column({ nullable: true })
  currency: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  projectDuration: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  projectBudget: number;

  @Column()
  organization_id: number;
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  filename: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ nullable: true })
  description: string;
}

@Entity()
export class ProjectItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @ManyToOne(() => Project)
  project_id: number;
}
