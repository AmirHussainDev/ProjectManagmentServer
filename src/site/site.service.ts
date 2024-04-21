import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteContracts, Site } from './site.entity';

@Injectable()
export class SiteService {

    constructor(
        @InjectRepository(Site)
        private readonly SiteRepository: Repository<Site>,

        @InjectRepository(SiteContracts)
        private readonly SiteContractsRepository: Repository<SiteContracts>,

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

    async getContract(id: number) {
        try {
            const SiteContracts = await this.SiteContractsRepository.findOneBy({
                id
            });
            return SiteContracts;
        } catch (error) {
            console.error('Error fetching contract details:', error);
            throw error;
        }
    }

    async getAllContracts(organizationId: number, subOrganizationId: number) {
        try {
            const SiteContracts = await this.SiteContractsRepository
                .createQueryBuilder('cd')
                .innerJoinAndSelect('cd.created_by', 'usr')
                .innerJoinAndSelect('cd.subOrganization', 'org')
                .innerJoinAndSelect('cd.site', 'site')
                .where('cd.organization_id = :organizationId', { organizationId })
                .andWhere('cd.sub_organization_id = :subOrganizationId', { subOrganizationId })
                .getMany();
            return SiteContracts;
        } catch (error) {
            console.error('Error fetching contract details:', error);
            throw error;
        }
    }
}

