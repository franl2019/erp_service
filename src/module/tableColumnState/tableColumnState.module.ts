import { Module } from "@nestjs/common";
import { TableColumnStateService } from "./tableColumnState.service";
import { TableColumnStateEntity } from "./tableColumnState.entity";
import { TableColumnStateController } from "./tableColumnState.controller";

@Module({
  providers: [TableColumnStateService,TableColumnStateEntity],
  controllers: [TableColumnStateController],
})
export class TableColumnStateModule {}