import {Body, Controller, Post} from "@nestjs/common";
import {UserAccountMxService} from "./userAccountMx.service";
import {UserAccountAuthFindDto} from "./dto/userAccountAuthFind.dto";
import {UserAccountAuthCreateDto} from "./dto/userAccountAuthCreate.dto";
import {UserAccountAuthDeleteDto} from "./dto/userAccountAuthDelete.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";

@Controller('erp/user_account_mx')
export class UserAccountMxController {

    constructor(
        private readonly userAccountMxService: UserAccountMxService
    ) {
    }

    @Post('find')
    public async find(@Body() userAccountAuthFindDto: UserAccountAuthFindDto) {
        const data = await this.userAccountMxService.find(userAccountAuthFindDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        }
    }

    @Post('create')
    public async create(@Body() userAccountAuthCreateDto: UserAccountAuthCreateDto, @ReqState() state: IState) {
        userAccountAuthCreateDto.creater = state.user.username;
        userAccountAuthCreateDto.createdAt = new Date();
        await this.userAccountMxService.create(userAccountAuthCreateDto);
        return {
            code: 200,
            msg: "创建成功"
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() userAccountAuthDeleteDto: UserAccountAuthDeleteDto) {
        await this.userAccountMxService.delete_data(userAccountAuthDeleteDto);
        return {
            code: 200,
            msg: "删除成功"
        }
    }
}