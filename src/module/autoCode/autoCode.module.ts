import { Module } from "@nestjs/common";
import { AutoCodeService } from "./autoCode.service";
import { AutoCodeEntity } from "./autoCode.entity";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [AutoCodeService, AutoCodeEntity],
  exports: [AutoCodeService]
})
export class AutoCodeModule {
}