import { Module } from '@nestjs/common';
import { ProductAreaService } from './productArea.service';
import { ProductAreaController } from './productArea.controller';
import { ProductAreaSql } from "./productArea.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [ProductAreaService,ProductAreaSql],
  controllers: [ProductAreaController],
  exports:[ProductAreaService]
})
export class ProductAreaModule {}
