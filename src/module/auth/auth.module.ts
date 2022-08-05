import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {UserModule} from "../user/user.module";
import {OperateareaModule} from "../operateArea/operatearea.module";
import {UserOperateAreaMxModule} from "../userOperateAreaMx/userOperateAreaMx.module";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import {JWT_CONFIG} from "../../config/jwt";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Module({
  imports: [
    MysqldbModule,
    UserModule,
    OperateareaModule,
    UserOperateAreaMxModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.SECRET_KEY,
      signOptions: { expiresIn: '7D' },
    }),
  ],
  providers: [AuthService, LocalStrategy,JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {
}
