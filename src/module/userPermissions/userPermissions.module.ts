import {Global, Module} from "@nestjs/common";
import {UserPermissionsService} from "./userPermissions.service";
import {RoleModule} from "../role/role.module";

@Global()
@Module({
    imports: [
        RoleModule,
    ],
    providers: [
        UserPermissionsService,
    ],
    exports: [
        UserPermissionsService
    ]
})
export class UserPermissionsModule {

}