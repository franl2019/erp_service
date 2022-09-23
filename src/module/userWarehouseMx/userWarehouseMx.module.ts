import { Module } from '@nestjs/common';
import { UserWarehouseMxSql } from "./userWarehouseMx.sql";
import { UserWarehouseMxService } from "./userWarehouseMx.service";
import { UserWarehouseMxController } from "./userWarehouseMx.controller";

@Module({
  providers: [UserWarehouseMxService,UserWarehouseMxSql],
  controllers: [UserWarehouseMxController],
  exports:[UserWarehouseMxService,UserWarehouseMxSql]
})
export class UserWarehouseMxModule {}