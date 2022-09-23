import {Module} from "@nestjs/common";
import {UserAccountMxEntity} from "./userAccountMx.entity";
import {UserAccountMxService} from "./userAccountMx.service";
import {UserAccountMxController} from "./userAccountMx.controller";

@Module({
    controllers: [UserAccountMxController],
    providers: [UserAccountMxEntity, UserAccountMxService],
    exports: [UserAccountMxService]
})
export class UserAccountMxModule {
}