import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { BuyEntity } from "./buy.entity";
import { BuyAreaModule } from "../buyArea/buyArea.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";
import {BuyAutoCodeModule} from "../buyAutoCode/buyAutoCode.module";

@Module({
  imports:[MysqldbModule,BuyAreaModule,BuyAutoCodeModule],
  providers: [BuyService,BuyEntity],
  controllers: [BuyController],
  exports:[BuyService,BuyEntity]
})
export class BuyModule {}
