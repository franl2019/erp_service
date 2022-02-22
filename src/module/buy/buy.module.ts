import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { BuySql } from "./buy.sql";
import { BuyAreaModule } from "../buyArea/buyArea.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule,BuyAreaModule],
  providers: [BuyService,BuySql],
  controllers: [BuyController],
  exports:[BuyService,BuySql]
})
export class BuyModule {}
