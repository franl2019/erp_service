import { Module } from '@nestjs/common';
import { UserOperateAreaMxService } from './userOperateAreaMx.service';
import { UserOperateAreaMxController } from './userOperateAreaMx.controller';
import { UserOperateAreaMxSql } from "./userOperateAreaMx.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [UserOperateAreaMxService,UserOperateAreaMxSql],
  controllers: [UserOperateAreaMxController],
  exports:[UserOperateAreaMxService,UserOperateAreaMxSql]
})
export class UserOperateAreaMxModule {}
