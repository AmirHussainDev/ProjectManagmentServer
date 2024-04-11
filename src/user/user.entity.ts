import { Organization, SubOrganization } from 'src/organization/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    organization_id: number;
    @ManyToOne(() => Organization)
    organization: Organization;

    @Column()
    sub_organization_id: number;
    @ManyToOne(() => SubOrganization)
    sub_organization: SubOrganization;

    @Column('text', { nullable: true })
    password: string;

    @Column('jsonb', { nullable: true })
    email: string[];

    @Column('text', { nullable: true })
    image: string[];

    @Column('text', { nullable: true })
    reports_to: number;

    @Column('text', { nullable: true })
    role_id: number;
}
