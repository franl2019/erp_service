import {Module} from "@nestjs/common";
import {UserRoleMxEntity} from "./userRoleMx.entity";
import {UserRoleMxService} from "./userRoleMx.service";
import {UserRoleMxController} from "./userRoleMx.controller";

@Module({
    controllers:[UserRoleMxController],
    providers:[
        UserRoleMxEntity,
        UserRoleMxService
    ],
    exports:[UserRoleMxService]
})
export class UserRoleMxModule {
}