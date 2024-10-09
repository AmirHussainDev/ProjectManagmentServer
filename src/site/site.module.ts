import { Module } from "@nestjs/common";
import { SiteController } from "./site.controller";
import { SiteService } from "./site.service";
import { SiteContracts, Site, SiteExpenses, SiteOwnerPayments, SiteContractPayments, SiteContractorPayments, TaskWorkLog } from "./site.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryItem } from "src/task/task.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Site,SiteContracts,SiteExpenses,SiteOwnerPayments,
            SiteContractPayments, SiteContractorPayments,InventoryItem]),
    ],
    providers: [SiteService],
    controllers: [SiteController],
    exports:[
        TypeOrmModule.forFeature([Site])
    ]
})
export class SiteModule { }