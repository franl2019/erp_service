import { Module } from '@nestjs/common';
import { BuyAreaService } from './buyArea.service';
import { BuyAreaController } from './buyArea.controller';
import { BuyAreaEntity } from "./buyArea.entity";

@Module({
  providers: [BuyAreaService,BuyAreaEntity],
  controllers: [BuyAreaController],
  exports:[BuyAreaService]
})
export class BuyAreaModule {}
