import { Module } from '@nestjs/common';
import { OperateareaService } from './operatearea.service';
import { OperateareaController } from './operatearea.controller';
import { OperateareaSql } from "./operatearea.sql";

@Module({
  providers: [OperateareaService,OperateareaSql],
  controllers: [OperateareaController],
  exports:[OperateareaService,OperateareaSql]
})
export class OperateareaModule {}
