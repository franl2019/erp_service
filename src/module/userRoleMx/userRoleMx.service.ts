import {Injectable} from "@nestjs/common";
import {UserRoleMxEntity} from "./userRoleMx.entity";
import {IUserRoleMx} from "./userRoleMx";

@Injectable()
export class UserRoleMxService {

    constructor(
        private readonly userRoleMxEntity: UserRoleMxEntity
    ) {
    }

    public async findAll(userid:number) {
        return await this.userRoleMxEntity.findAll(userid)
    }

    public async findOne(userRoleMx:IUserRoleMx){
        return await this.userRoleMxEntity.findOne(userRoleMx)
    }

    public async create(userRoleMx:IUserRoleMx){
        return await this.userRoleMxEntity.create(userRoleMx);
    }

    public async delete_data(userRoleMx:IUserRoleMx){
        return await this.userRoleMxEntity.delete_data(userRoleMx)
    }
}