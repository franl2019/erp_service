import { Module } from '@nestjs/common';
import { ClientAreaService } from './clientArea.service';
import { ClientAreaController } from './clientArea.controller';
import { ClientAreaEntity } from "./clientArea.entity";

@Module({
  providers: [ClientAreaService,ClientAreaEntity],
  controllers: [ClientAreaController],
  exports:[ClientAreaService,ClientAreaEntity]
})
export class ClientAreaModule {}
