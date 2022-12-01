import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {UserRoleMxEntity} from "./userRoleMx.entity";
import {IUserRoleMx} from "./userRoleMx";
import {Cache} from "cache-manager";

@Injectable()
export class UserRoleMxService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly userRoleMxEntity: UserRoleMxEntity,
    ) {
    }

    public async findByUserId(userid:number) {
        return await this.userRoleMxEntity.findByUserId(userid)
    }

    public async findByRoleId(roleId:number){
        return await this.userRoleMxEntity.findByRoleId(roleId);
    }

    public async findOne(userRoleMx:IUserRoleMx){
        return await this.userRoleMxEntity.findOne(userRoleMx)
    }

    public async isExist(roleId:number,userId:number){
        return await this.userRoleMxEntity.isExist(roleId,userId);
    }

    public async create(userRoleMx:IUserRoleMx){
        const isExist = await this.isExist(userRoleMx.roleId,userRoleMx.userid)
        if(isExist){
            const result = await this.userRoleMxEntity.create(userRoleMx);
            await this.clearUserPermissionsCache(userRoleMx.userid);
            return result
        }else{
            return Promise.reject(new Error("角色已经拥有该用户"))
        }
    }

    public async delete_data(userRoleMx:IUserRoleMx){
        const result = await this.userRoleMxEntity.delete_data(userRoleMx);
        await this.clearUserPermissionsCache(userRoleMx.userid);
        return result;
    }

    private async clearUserPermissionsCache(userId:number){
       await this.cacheManager.del(String(userId));
    }
}