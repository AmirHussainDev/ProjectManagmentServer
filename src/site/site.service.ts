import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './site.entity';

@Injectable()
export class SiteService {
    constructor(
        @InjectRepository(Site)
        private readonly SiteRepository: Repository<Site>,
        
    ) { }

    async createSite(organization_id: number, name: string): Promise<Site> {
        const Site = this.SiteRepository.create({ organization_id, name });
        return this.SiteRepository.save(Site);
    }

    async getAllSites(): Promise<Site[]> {
        return this.SiteRepository.find();
    }

    async findByOrganizationId(organization_id: number): Promise<Site[]> {
        return this.SiteRepository.findBy({ organization_id });
    }

}

