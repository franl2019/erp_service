import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";
import { ProductAreaModule } from "../productArea/productArea.module";
import {ProductAutoCodeModule} from "../productAutoCode/productAutoCode.module";
import {ProductOtherUnitMxModule} from "../productOtherUnitMx/productOtherUnitMx.module";


@Module({
  imports:[ProductAreaModule,ProductAutoCodeModule,ProductOtherUnitMxModule],
  providers: [ProductService,ProductEntity],
  controllers: [ProductController],
  exports:[ProductService,ProductEntity]
})
export class ProductModule {}
