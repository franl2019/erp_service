import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientSql } from "./client.sql";
import { ClientAreaModule } from "../clientArea/clientArea.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";


@Module({
  imports:[MysqldbModule,ClientAreaModule],
  providers: [ClientService,ClientSql],
  controllers: [ClientController],
  exports:[ClientService,ClientSql]
})
export class ClientModule {}
