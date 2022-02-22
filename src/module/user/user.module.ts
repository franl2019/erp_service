import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSql } from "./user.sql";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports:[MysqldbModule],
  providers: [UserService,UserSql],
  controllers: [UserController],
  exports:[UserService,UserSql]
})
export class UserModule {}
