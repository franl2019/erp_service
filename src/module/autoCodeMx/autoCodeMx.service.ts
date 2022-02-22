import {AutoCodeMxEntity} from "./autoCodeMx.entity";
import {Injectable} from "@nestjs/common";
import * as moment from "moment";
import {AutoCodeMx} from "./autoCodeMx";
import {AutoCodeService} from "../autoCode/autoCode.service";

@Injectable()
export class AutoCodeMxService {

    constructor(
        private readonly autocodeMxEntity: AutoCodeMxEntity,
        private readonly autocodeService:AutoCodeService
    ) {
    }

    //进仓单获取自动单号
    private async getInboundAutoNo(codeType: number): Promise<AutoCodeMx> {
        const autoCodeMxOld = await this.autocodeMxEntity.getInboundAutocodeMx(codeType);

        if (autoCodeMxOld) {
            autoCodeMxOld.codeNo = autoCodeMxOld.codeNo + 1;
            await this.autocodeMxEntity.update(autoCodeMxOld);
        } else {
            await this.createAutoCodeMx(codeType);
        }

        return await this.autocodeMxEntity.getInboundAutocodeMx(codeType)
    }

    //创建自动单号明细
    private async createAutoCodeMx(codeType: number) {
        const addAutoCodeMx = new AutoCodeMx();
        addAutoCodeMx.codeType = codeType;
        addAutoCodeMx.codeNo = 1;
        addAutoCodeMx.createdAt = new Date();

        //新增当天顺序号记录
        await this.autocodeMxEntity.add(addAutoCodeMx);
    }

    //获取自动进仓单号
    public async getAutoCode(codeType: number): Promise<string> {
        //获取进仓单自动单号代号
        const autoCodeName = await this.autocodeService.getAutoCodeName(codeType);
        //获取进仓单自动单号顺序号
        const autoCodeMx = await this.getInboundAutoNo(codeType);
        const autoCodeToday = moment(autoCodeMx.createdAt).format("YYYYMMDD");
        //A-代号-日期-顺序号
        return `A-${autoCodeName}-${autoCodeToday}-${autoCodeMx.codeNo}`;
    }
}