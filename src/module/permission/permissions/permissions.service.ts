import {Injectable} from "@nestjs/common";
import {PermissionsEntity} from "./permissions.entity";
import {IPermissions} from "./permissions";
import {PermissionsFindAllDto} from "./dto/permissionsFindAll.dto";

@Injectable()
export class PermissionsService {

    constructor(
        private readonly permissionsEntity:PermissionsEntity
    ) {
    }

    public async findAll(findDto:PermissionsFindAllDto){
        return await this.permissionsEntity.findAll(findDto);
    }

    public async findOne(permissionsId:number){
        return await this.permissionsEntity.findOne(permissionsId);
    }

    public async create(permissions:IPermissions){
        return await this.permissionsEntity.create(permissions);
    }

    public async update(permission:IPermissions){
        return await this.permissionsEntity.update(permission);
    }

    // public async delete_data(permissionsId:number,userName:string){
    //     return await this.permissionsEntity.delete_data(permissionsId,userName);
    // }
}