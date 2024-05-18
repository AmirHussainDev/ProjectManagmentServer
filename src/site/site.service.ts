import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteContracts, Site, SiteExpenses, SiteOwnerPayments, SiteContractPayments, SiteContractorWorkLog, SiteContractorPayments } from './site.entity';

@Injectable()
export class SiteService {

    constructor(
        @InjectRepository(Site)
        private readonly SiteRepository: Repository<Site>,

        @InjectRepository(SiteContracts)
        private readonly SiteContractsRepository: Repository<SiteContracts>,

        @InjectRepository(SiteExpenses)
        private readonly siteExpensesRepository: Repository<SiteExpenses>,

        @InjectRepository(SiteOwnerPayments)
        private readonly siteOwnerPaymentsRepository: Repository<SiteOwnerPayments>,

        @InjectRepository(SiteContractPayments)
        private readonly siteContractPaymentsRepository: Repository<SiteContractPayments>,
        
        @InjectRepository(SiteContractorWorkLog)
        private readonly siteContractorWorkLogRepository: Repository<SiteContractorWorkLog>,

        @InjectRepository(SiteContractorPayments)
        private readonly siteContractorPaymentsRepository: Repository<SiteContractorPayments>,



    ) { }

    async createSite(siteDetails: Site): Promise<Site> {
        const Site = this.SiteRepository.create({ ...siteDetails });
        return this.SiteRepository.save(Site);
    }

    async getAllSites(): Promise<Site[]> {
        return this.SiteRepository.find();
    }


    async findBySiteId(organization_id: number, sub_organization_id: number, site_id: number): Promise<Site> {
        return this.SiteRepository.createQueryBuilder('site')
            .where('site.id = :id', { id: site_id })
            .andWhere('site.organization_id = :organization_id', { organization_id })
            .getOne();
    }

    async findByOrganizationId(organization_id: number, sub_organization_id: number): Promise<Site[]> {
        return this.SiteRepository.createQueryBuilder('site')
            .where('site.organization_id = :organization_id', { organization_id })
            .andWhere('site.sub_organization_id = :sub_organization_id', { sub_organization_id })
            .getMany();
    }

    async updateSiteDetails(details: Site) {
        await this.SiteRepository.update(details.id, details);
        return true;

    }

    async createSiteContracts(details: SiteContracts) {
        const purchase = this.SiteContractsRepository.create(details);
        const resp = await this.SiteContractsRepository.save(purchase);
        return resp;
    }

    async updateSiteContracts(details: SiteContracts) {
        await this.SiteContractsRepository.update(details.id, details);
        return true;
    }

    async getContract(organizationId: number, siteId: number, id: number) {
        try {
            const SiteContracts = await this.SiteContractsRepository.createQueryBuilder('cd')
                .where('cd.organization_id = :organizationId', { organizationId })
                .andWhere('cd.site_id = :siteId', { siteId })
                .andWhere('cd.id = :id', { id }).getOne()
            return SiteContracts;
        } catch (error) {
            console.error('Error fetching contract details:', error);
            throw error;
        }
    }

    async getAllContracts(organizationId: number, subOrganizationId: number, siteId: number) {
        try {
            const SiteContracts = await this.SiteContractsRepository
                .createQueryBuilder('cd')
                .innerJoinAndSelect('cd.created_by', 'usr')
                .innerJoinAndSelect('cd.subOrganization', 'org')
                .innerJoinAndSelect('cd.site', 'site')
                .where('cd.organization_id = :organizationId', { organizationId })
                .andWhere('cd.sub_organization_id = :subOrganizationId', { subOrganizationId })
                .andWhere('cd.site_id = :siteId', { siteId })
                .getMany();
            return SiteContracts;
        } catch (error) {
            console.error('Error fetching contract details:', error);
            throw error;
        }
    }

    async createSiteExpenses(details: SiteExpenses) {
        const expense = this.siteExpensesRepository.create(details);
        const resp = await this.siteExpensesRepository.save(expense);
        return resp;
    }

    async updateSiteExpenses(details: SiteContracts) {
        await this.siteExpensesRepository.update(details.id, details);
        return true;
    }


    async getSiteExpenses(organization_id: number, sub_organization_id: number, site_id: number) {
        const siteExpenses = await this.siteExpensesRepository.find({
            where: { site: { id: site_id }, organization: { id: organization_id }, subOrganization: { id: sub_organization_id } },
            relations: ['created_by', 'organization', 'subOrganization', 'site'],
            order: { id: 'ASC' }// Include relations if needed
        });
        return siteExpenses;
    }

    async createSiteOwnerPayment(details: SiteOwnerPayments) {
        const OwnerPayment = this.siteOwnerPaymentsRepository.create(details);
        const resp = await this.siteOwnerPaymentsRepository.save(OwnerPayment);
        return resp;
    }

    async updateSiteOwnerPayments(details: SiteOwnerPayments) {
        await this.siteOwnerPaymentsRepository.update(details.id, details);
        return true;
    }


    async getSiteOwnerPayments(organization_id: number, sub_organization_id: number, site_id: number) {
        const siteOwnerPayments = await this.siteOwnerPaymentsRepository.find({
            where: { site: { id: site_id }, organization: { id: organization_id }, subOrganization: { id: sub_organization_id } },
            relations: ['created_by', 'organization', 'subOrganization', 'site'],
            order: { id: 'ASC' }// Include relations if needed
        });
        return siteOwnerPayments;
    }

    async getSiteContractorsPayments(organizationId: number, subOrganizationId: number, siteId: number) {
       // console.log('here')
        const siteContracts = await this.SiteContractsRepository
        .createQueryBuilder('sc')
        .select('sc.id', 'id')
        .addSelect('sc.subject', 'subject')
        .addSelect('sc.contractor', 'contractor')
        .addSelect('SUM(CAST(scp.amount AS INTEGER))', 'amount')
        .leftJoin('site_contractor_payments', 'scp', 'sc.id = scp.contract_id')
        .where('sc.organization_id = :organizationId', { organizationId })
        .andWhere('sc.sub_organization_id = :subOrganizationId', { subOrganizationId })
        .andWhere('sc.site_id = :siteId', { siteId })
        .groupBy('sc.id')
        .addGroupBy('sc.subject')
        .addGroupBy('sc.contractor')
        .getRawMany();

        return siteContracts;
    }

    async createSiteWorkLog(details: SiteContractorWorkLog) {
        const worklog = this.siteContractorWorkLogRepository.create(details);
        const resp = await this.siteContractorWorkLogRepository.save(worklog);
        return resp;
    }


    async getSiteWorkLogs(organization_id: number, sub_organization_id: number, site_id: number,contract_id: number) {
        const siteOwnerPayments = await this.siteContractorWorkLogRepository.find({
            where: { site: { id: site_id }, organization: { id: organization_id }, subOrganization: { id: sub_organization_id },contract:{id:contract_id} },
            relations: ['created_by', 'organization', 'subOrganization', 'site','contract'],
            order: { id: 'ASC' }// Include relations if needed
        });
        return siteOwnerPayments;
    }

    async createSiteContractPayment(details: SiteContractorPayments) {
        const worklog = this.siteContractorPaymentsRepository.create(details);
        const resp = await this.siteContractorPaymentsRepository.save(worklog);
        return resp;
    }


    async getSiteContractPayments(organization_id: number, sub_organization_id: number, site_id: number,contract_id: number) {
        const siteOwnerPayments = await this.siteContractorPaymentsRepository.find({
            where: { site: { id: site_id }, organization: { id: organization_id }, subOrganization: { id: sub_organization_id },contract:{id:contract_id} },
            relations: ['created_by', 'organization', 'subOrganization', 'site','contract'],
            order: { id: 'ASC' }// Include relations if needed
        });
        return siteOwnerPayments;
    }
}

