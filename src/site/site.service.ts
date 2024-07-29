import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SiteContracts,
  Site,
  SiteExpenses,
  SiteOwnerPayments,
  SiteContractPayments,
  SiteContractorWorkLog,
  SiteContractorPayments,
} from './site.entity';
import { InventoryItem } from 'src/inventory-purchase/inventory-purchase.entity';
import { SiteStatisticsDto } from './site.interface.dto';
import { error } from 'console';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly SiteRepository: Repository<Site>,

    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,

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

  async getSiteStatistics(id: number): Promise<SiteStatisticsDto> {
    try {
      const site = await this.SiteRepository.findOneBy({ id });

      if (!site) {
        return;
      }

      const siteTotalBudget = parseFloat(site.budget);

      const siteExpensesSum = await this.siteExpensesRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'sum')
        .where('expense.site_id = :siteId', { siteId: id })
        .getRawOne();

      const siteGeneralExpensesSum = await this.siteExpensesRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.amount::int)', 'sum')
        .where('expense.site_id = :siteId AND expense.is_general = true', {
          siteId: id,
        })
        .getRawOne();

      const siteContractPaymentsSum =
        await this.siteContractorPaymentsRepository
          .createQueryBuilder('contract_payment')
          .select('SUM(contract_payment.amount::int)', 'sum')
          .where('contract_payment.site_id = :siteId', { siteId: id })
          .getRawOne();

      const siteOwnerPaymentsSum = await this.siteOwnerPaymentsRepository
        .createQueryBuilder('owner_payment')
        .select('SUM(owner_payment.amount::int)', 'sum')
        .where('owner_payment.site_id = :siteId', { siteId: id })
        .getRawOne();

      return {
        siteId: site.id,
        siteName: site.name,
        siteTotalBudget,
        siteExpensesSum: parseFloat(siteExpensesSum.sum) || 0,
        siteGeneralExpensesSum: parseFloat(siteGeneralExpensesSum.sum) || 0,
        siteContractPaymentsSum: parseFloat(siteContractPaymentsSum.sum) || 0,
        siteOwnerPaymentsSum: parseFloat(siteOwnerPaymentsSum.sum) || 0,
      };
    } catch (err) {
      throw error(err);
    }
  }

  async getAllSitesStatistics(
    organization_id: number,
    sub_organization_id: number,
  ): Promise<SiteStatisticsDto[]> {
    try {
      const sitesQuery = this.SiteRepository.createQueryBuilder('site');

      if (organization_id) {
        sitesQuery.andWhere('site.organization_id = :organization_id', {
          organization_id,
        });
      }

      if (sub_organization_id) {
        sitesQuery.andWhere('site.sub_organization_id = :sub_organization_id', {
          sub_organization_id,
        });
      }
      sitesQuery.andWhere('site.state = 4', {
        sub_organization_id,
      });
      const sites = await sitesQuery.getMany();

      const statisticsPromises = sites.map((site) =>
        this.getSiteStatistics(site.id),
      );
      const allSitesStatistics = await Promise.all(statisticsPromises);

      return allSitesStatistics;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async findBySiteId(
    organization_id: number,
    sub_organization_id: number,
    site_id: number,
  ): Promise<Site> {
    return this.SiteRepository.createQueryBuilder('site')
      .where('site.id = :id', { id: site_id })
      .andWhere('site.organization_id = :organization_id', { organization_id })
      .getOne();
  }

  async findByOrganizationId(
    organization_id: number,
    sub_organization_id: number,
  ): Promise<Site[]> {
    return this.SiteRepository.createQueryBuilder('site')
      .where('site.organization_id = :organization_id', { organization_id })
      .andWhere('site.sub_organization_id = :sub_organization_id', {
        sub_organization_id,
      })
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
      const SiteContracts =
        await this.SiteContractsRepository.createQueryBuilder('cd')
          .where('cd.organization_id = :organizationId', { organizationId })
          .andWhere('cd.site_id = :siteId', { siteId })
          .andWhere('cd.id = :id', { id })
          .getOne();
      return SiteContracts;
    } catch (error) {
      console.error('Error fetching contract details:', error);
      throw error;
    }
  }

  async getAllContracts(
    organizationId: number,
    subOrganizationId: number,
    siteId: number,
  ) {
    try {
      const SiteContracts =
        await this.SiteContractsRepository.createQueryBuilder('cd')
          .innerJoinAndSelect('cd.created_by', 'usr')
          .innerJoinAndSelect('cd.subOrganization', 'org')
          .innerJoinAndSelect('cd.site', 'site')
          .where('cd.organization_id = :organizationId', { organizationId })
          .andWhere('cd.sub_organization_id = :subOrganizationId', {
            subOrganizationId,
          })
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
    const inventoryExistingItem = await this.inventoryItemRepository.findOne({
      where: {
        purchase_id: details.purchase_id,
        name: expense.name,
      },
      relations: ['vendor'],
    });
    const site = await this.SiteRepository.findOne({
      where: { id: details.site.id },
      relations: ['organization', 'subOrganization'],
    });
    const resp = await this.siteExpensesRepository.save(expense);

    if (!details.is_general) {
      const inventory = {
        organization_id: site.organization.id,
        sub_organization_id: site.subOrganization.id,
        site_id: site.id,
        site_no: site.site_no,
        stock_in: false,
        name: expense.name,
        vendor: inventoryExistingItem.vendor,
        isSiteBased: true,
        qty: expense.quantity,
        unit_price: inventoryExistingItem.unit_price,
        description: inventoryExistingItem.description,
        total: inventoryExistingItem.total,
        date_created: new Date(),
      };
      const item = await this.inventoryItemRepository.create(inventory);
      await this.inventoryItemRepository.save(item);
    }
    return resp;
  }

  async updateSiteExpenses(details: SiteContracts) {
    await this.siteExpensesRepository.update(details.id, details);
    return true;
  }

  async getSiteExpenses(
    organization_id: number,
    sub_organization_id: number,
    site_id: number,
  ) {
    const siteExpenses = await this.siteExpensesRepository.find({
      where: {
        site: { id: site_id },
        organization: { id: organization_id },
        subOrganization: { id: sub_organization_id },
      },
      order: { id: 'ASC' }, // Include relations if needed
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

  async getSiteOwnerPayments(
    organization_id: number,
    sub_organization_id: number,
    site_id: number,
  ) {
    const siteOwnerPayments = await this.siteOwnerPaymentsRepository.find({
      where: {
        site: { id: site_id },
        organization: { id: organization_id },
        subOrganization: { id: sub_organization_id },
      },
      order: { id: 'ASC' }, // Include relations if needed
    });
    return siteOwnerPayments;
  }

  async getSiteContractorsPayments(
    organizationId: number,
    subOrganizationId: number,
    siteId: number,
  ) {
    // console.log('here')
    const siteContracts = await this.SiteContractsRepository.createQueryBuilder(
      'sc',
    )
      .select('sc.id', 'id')
      .addSelect('sc.subject', 'subject')
      .addSelect('sc.contractor', 'contractor')
      .addSelect('SUM(CAST(scp.amount AS INTEGER))', 'amount')
      .leftJoin('site_contractor_payments', 'scp', 'sc.id = scp.contract_id')
      .where('sc.organization_id = :organizationId', { organizationId })
      .andWhere('sc.sub_organization_id = :subOrganizationId', {
        subOrganizationId,
      })
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

  async getSiteWorkLogs(
    organization_id: number,
    sub_organization_id: number,
    site_id: number,
    contract_id: number,
  ) {
    const siteOwnerPayments = await this.siteContractorWorkLogRepository.find({
      where: {
        site: { id: site_id },
        organization: { id: organization_id },
        subOrganization: { id: sub_organization_id },
        contract: { id: contract_id },
      },
      order: { id: 'ASC' }, // Include relations if needed
    });
    return siteOwnerPayments;
  }

  async createSiteContractPayment(details: SiteContractorPayments) {
    const worklog = this.siteContractorPaymentsRepository.create(details);
    const resp = await this.siteContractorPaymentsRepository.save(worklog);
    return resp;
  }

  async getSiteContractPayments(
    organization_id: number,
    sub_organization_id: number,
    site_id: number,
    contract_id: number,
  ) {
    const siteOwnerPayments = await this.siteContractorPaymentsRepository.find({
      where: {
        site: { id: site_id },
        organization: { id: organization_id },
        subOrganization: { id: sub_organization_id },
        contract: { id: contract_id },
      },
      order: { id: 'ASC' }, // Include relations if needed
    });
    return siteOwnerPayments;
  }
}
