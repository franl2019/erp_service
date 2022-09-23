import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSql } from "./user.sql";

@Module({
  providers: [UserService,UserSql],
  controllers: [UserController],
  exports:[UserService,UserSql]
})
export class UserModule {}
