import { Organization } from 'src/organization/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class RolePermissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role_name: string;

    @Column()
    organization_id: number;
    @ManyToOne(() => Organization)
    organization: Organization;

    @Column('jsonb', { nullable: true })
    role_permissions: any;

}
