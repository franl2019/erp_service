import { Module } from '@nestjs/common';
import { ClientAreaService } from './clientArea.service';
import { ClientAreaController } from './clientArea.controller';
import { ClientAreaEntity } from "./clientArea.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [ClientAreaService,ClientAreaEntity],
  controllers: [ClientAreaController],
  exports:[ClientAreaService,ClientAreaEntity]
})
export class ClientAreaModule {}
