import { Module } from "@nestjs/common";
import { RoleService } from "./role/role.service";
import { RolePermissionsMxEntity } from "./rolePermissionsMx/rolePermissionsMx.entity";
import { RolePermissionsMxService } from "./rolePermissionsMx/rolePermissionsMx.service";
import { RoleController } from "./role.controller";
import { RoleEntity } from "./role/role.entity";
import {UserRoleMxModule} from "../userRoleMx/userRoleMx.module";

@Module({
    imports:[
        UserRoleMxModule
    ],
    controllers: [RoleController],
    providers: [
        RoleEntity,
        RoleService,
        RolePermissionsMxEntity,
        RolePermissionsMxService,
    ],
    exports: [RoleEntity,RolePermissionsMxEntity,RoleService,RolePermissionsMxService]
})
export class RoleModule {
}