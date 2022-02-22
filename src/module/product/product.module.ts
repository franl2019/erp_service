import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductSql } from "./product.sql";
import { ProductService } from "./product.service";
import { ProductAreaModule } from "../productArea/productArea.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";


@Module({
  imports:[MysqldbModule,ProductAreaModule],
  providers: [ProductService,ProductSql],
  controllers: [ProductController],
  exports:[ProductService,ProductSql]
})
export class ProductModule {}
