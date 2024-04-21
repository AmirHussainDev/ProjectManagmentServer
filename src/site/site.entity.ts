import { Organization, SubOrganization } from 'src/organization/organization.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Site {
    @PrimaryGeneratedColumn()
    id: number;

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
    @Column()
    details: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @Column({nullable:true, type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    total: number;

    @Column()
    state: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_modified: Date;

    @ManyToOne(type => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @ManyToOne(type => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;
}

@Entity()
export class SiteExpenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    amount: string;

    @Column()
    verified: boolean;

    @Column()
    isPaid: boolean;
    
    @Column()
    contact_no: string;
    
    @Column()
    note: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by_id' })
    created_by: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @ManyToOne(type => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    
    @ManyToOne(type => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(type => Site)
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
    isPaid: boolean;
        
    @Column()
    note: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by_id' })
    created_by: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @ManyToOne(type => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    
    @ManyToOne(type => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(type => Site)
    @JoinColumn({ name: 'site_id' })
    site: Site;

}



@Entity()
export class SiteContracts {
    @PrimaryGeneratedColumn()
    id: number;



    @ManyToOne(type => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @ManyToOne(type => SubOrganization)
    @JoinColumn({ name: 'sub_organization_id' })
    subOrganization: SubOrganization;

    @ManyToOne(type => Site)
    @JoinColumn({ name: 'site_id' })
    site: Site;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'created_by_id' })
    created_by: User;

    @Column({ nullable: true })
    attachment: string;

    @Column({ nullable: true })
    terms: string;

    @Column({nullable:true, type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    total: number;

    @Column()
    state: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_created: Date;

    @Column()
    contractor: string;

    @Column()
    subject: string;

    @Column()
    contract_type: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    contract_start_date: Date;

    @Column({ type: 'timestamp' })
    contract_end_date: Date;

    @Column()
    with_material: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
    payment_schedule: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
    amount_per_schedule: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
    amount_per_day: number;
}
