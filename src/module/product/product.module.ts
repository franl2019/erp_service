import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";
import { ProductAreaModule } from "../productArea/productArea.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import {ProductAutoCodeModule} from "../productAutoCode/productAutoCode.module";


@Module({
  imports:[MysqldbModule,ProductAreaModule,ProductAutoCodeModule],
  providers: [ProductService,ProductEntity],
  controllers: [ProductController],
  exports:[ProductService,ProductEntity]
})
export class ProductModule {}
