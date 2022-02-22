import {Injectable} from "@nestjs/common";
import {UserAccountMxEntity} from "./userAccountMx.entity";
import {IUserAccountMx} from "./userAccountMx";
import {UserAccountAuthFindDto} from "./dto/userAccountAuthFind.dto";
import {UserAccountAuthDeleteDto} from "./dto/userAccountAuthDelete.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class UserAccountMxService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly userAccountMxEntity: UserAccountMxEntity
    ) {
    }

    public async findOne(findOneDto: { userid: number, accountId: number }) {
        return await this.userAccountMxEntity.findOne(findOneDto.accountId, findOneDto.userid);
    }

    public async find(findDto: UserAccountAuthFindDto) {
        return await this.userAccountMxEntity.find(findDto);
    }

    public async create(userAccountMx: IUserAccountMx) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const userAccountAuth = await this.userAccountMxEntity.findOne(userAccountMx.accountId,userAccountMx.userid)
            if(userAccountAuth&&userAccountAuth.accountId){
                return Promise.reject(new Error("新增权限失败，该账户权限已拥有"))
            }
            return await this.userAccountMxEntity.create([userAccountMx]);
        })

    }

    public async delete_data(userAccountAuthDeleteDto: UserAccountAuthDeleteDto) {
        return await this.userAccountMxEntity.delete_data(userAccountAuthDeleteDto.userid, userAccountAuthDeleteDto.accountId);
    }
}