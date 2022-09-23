import { Module } from "@nestjs/common";
import { AutoCodeService } from "./autoCode.service";
import { AutoCodeEntity } from "./autoCode.entity";

@Module({
  providers: [AutoCodeService, AutoCodeEntity],
  exports: [AutoCodeService]
})
export class AutoCodeModule {
}