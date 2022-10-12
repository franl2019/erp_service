import {Module} from "@nestjs/common";
import {PermissionsThemeEntity} from "./permissions_theme/permissionsTheme.entity";
import {PermissionsThemeService} from "./permissions_theme/permissionsTheme.service";
import {PermissionsEntity} from "./permissions/permissions.entity";
import {PermissionsService} from "./permissions/permissions.service";
import {PermissionController} from "./permission.controller";

@Module({
    controllers:[
        PermissionController
    ],
    providers:[
        PermissionsThemeEntity,
        PermissionsThemeService,
        PermissionsEntity,
        PermissionsService
    ]
})
export class PermissionModule {
}