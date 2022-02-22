import { Module } from '@nestjs/common';
import { OperateareaService } from './operatearea.service';
import { OperateareaController } from './operatearea.controller';
import { OperateareaSql } from "./operatearea.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [OperateareaService,OperateareaSql],
  controllers: [OperateareaController],
  exports:[OperateareaService,OperateareaSql]
})
export class OperateareaModule {}
