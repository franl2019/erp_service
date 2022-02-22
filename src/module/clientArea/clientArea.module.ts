import { Module } from '@nestjs/common';
import { ClientAreaService } from './clientArea.service';
import { ClientAreaController } from './clientArea.controller';
import { ClientAreaSql } from "./clientArea.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [ClientAreaService,ClientAreaSql],
  controllers: [ClientAreaController],
  exports:[ClientAreaService,ClientAreaSql]
})
export class ClientAreaModule {}
