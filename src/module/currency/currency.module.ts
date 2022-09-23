import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from "./currency.service";
import { CurrencyEntity } from "./currency.entity";

@Module({
  providers: [CurrencyService,CurrencyEntity],
  controllers: [CurrencyController],
  exports:[CurrencyService,CurrencyEntity]
})
export class CurrencyModule {}
