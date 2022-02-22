import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { OperateareaModule } from "../operateArea/operatearea.module";
import { UserOperateAreaMxModule } from "../userOperateAreaMx/userOperateAreaMx.module";
import { MysqldbModule } from "../mysqldb/mysqldb.module";

@Module({
  imports: [MysqldbModule,UserModule,OperateareaModule,UserOperateAreaMxModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {
}
