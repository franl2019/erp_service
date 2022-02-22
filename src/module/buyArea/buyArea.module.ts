import { Module } from '@nestjs/common';
import { BuyAreaService } from './buyArea.service';
import { BuyAreaController } from './buyArea.controller';
import { BuyAreaSql } from "./buyArea.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [BuyAreaService,BuyAreaSql],
  controllers: [BuyAreaController],
  exports:[BuyAreaService,BuyAreaSql]
})
export class BuyAreaModule {}
