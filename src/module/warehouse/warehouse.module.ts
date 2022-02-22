import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseSql } from "./warehouse.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [WarehouseService,WarehouseSql],
  controllers: [WarehouseController],
  exports:[WarehouseService,WarehouseSql]
})
export class WarehouseModule {}
