import { Module } from '@nestjs/common';
import { UserWarehouseMxSql } from "./userWarehouseMx.sql";
import { UserWarehouseMxService } from "./userWarehouseMx.service";
import { UserWarehouseMxController } from "./userWarehouseMx.controller";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [UserWarehouseMxService,UserWarehouseMxSql],
  controllers: [UserWarehouseMxController],
  exports:[UserWarehouseMxService,UserWarehouseMxSql]
})
export class UserWarehouseMxModule {}