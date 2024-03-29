import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from "./client.entity";
import { ClientAreaModule } from "../clientArea/clientArea.module";
import {ClientAutoCodeModule} from "../clientAutoCode/clientAutoCode.module";


@Module({
  imports:[
    ClientAreaModule,
    ClientAutoCodeModule
  ],
  providers: [ClientService,ClientEntity],
  controllers: [ClientController],
  exports:[ClientService,ClientEntity]
})
export class ClientModule {}
