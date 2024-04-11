import { Organization } from 'src/organization/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Site {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    organization_id: number;
    @ManyToOne(() => Organization)
    organization: Organization;

}

