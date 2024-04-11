import { Module } from "@nestjs/common";
import { SiteController } from "./site.controller";
import { SiteService } from "./site.service";
import { Site } from "./site.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Site]),
    ],
    providers: [SiteService],
    controllers: [SiteController],
    exports:[
        TypeOrmModule.forFeature([Site])
    ]
})
export class SiteModule { }