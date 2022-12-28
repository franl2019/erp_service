import {Injectable} from "@nestjs/common";
import {PermissionsThemeEntity} from "./permissionsTheme.entity";
import {IPermissionsTheme} from "./permissionsTheme";
import {PermissionsService} from "../permissions/permissions.service";
import {MysqldbAls} from "../../mysqldb/mysqldbAls";

@Injectable()
export class PermissionsThemeService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly permissionsThemeEntity: PermissionsThemeEntity,
        private readonly permissionsService: PermissionsService
    ) {
    }

    public async findAll() {
        return await this.permissionsThemeEntity.findAll();
    }

    public async findOne(permissionsThemeId: number) {
        return await this.permissionsThemeEntity.findOne(permissionsThemeId);
    }

    public async create(permissionsTheme: IPermissionsTheme) {
        return await this.permissionsThemeEntity.create(permissionsTheme);
    }

    public async update(permissionsTheme: IPermissionsTheme) {
        return await this.permissionsThemeEntity.update(permissionsTheme);
    }

    public async delete_data(permissionsThemeId: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const permissionsList = await this.permissionsService.findAll({
                permissionsCode: "",
                createdAt: undefined,
                creater: "",
                del_uuid: 0,
                deletedAt: undefined,
                deleter: "",
                permissionsId: 0,
                permissionsName: "",
                permissionsThemeId: permissionsThemeId,
                updatedAt: undefined,
                updater: ""
            })

            if (permissionsList.length > 0) return Promise.reject(new Error('删除失败,权限主题下有权限资料'));

            return await this.permissionsThemeEntity.delete_data(permissionsThemeId, userName);
        })
    }
}