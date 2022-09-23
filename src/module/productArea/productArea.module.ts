import { Module } from '@nestjs/common';
import { ProductAreaService } from './productArea.service';
import { ProductAreaController } from './productArea.controller';
import { ProductAreaSql } from "./productArea.sql";

@Module({
  providers: [ProductAreaService,ProductAreaSql],
  controllers: [ProductAreaController],
  exports:[ProductAreaService]
})
export class ProductAreaModule {}
