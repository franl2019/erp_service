import { Module } from "@nestjs/common";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import { TableColumnStateService } from "./tableColumnState.service";
import { TableColumnStateEntity } from "./tableColumnState.entity";
import { TableColumnStateController } from "./tableColumnState.controller";

@Module({
  imports:[MysqldbModule],
  providers: [TableColumnStateService,TableColumnStateEntity],
  controllers: [TableColumnStateController],
})
export class TableColumnStateModule {}