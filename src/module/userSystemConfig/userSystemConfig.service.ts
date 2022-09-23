import {Injectable} from "@nestjs/common";
import {ISystemConfigHead} from "../systemConfig/systemConfigHead/systemConfigHead";
import {SystemConfigService} from "../systemConfig/systemConfig.service";

@Injectable()
export class UserSystemConfigService implements ISystemConfigHead {

    systemConfigHeadId: number;
    systemConfigName: string;
    createdAt: Date;
    creater: string;
    updatedAt: Date | null;
    updater: string | null;
    del_uuid: number;
    deletedAt: Date | null;
    deleter: string | null;

    //<systemConfigOptionId,systemConfigOptionMxId>
    private systemConfigMxMap: Map<number, number> = new Map();

    constructor(
        private readonly systemConfigService: SystemConfigService
    ) {
    }

    public async init(systemConfigHeadId: number) {
        await this.getSystemConfigMxList(systemConfigHeadId)
    }

    public async getSystemConfigMxList(systemConfigHeadId: number) {
        const systemConfigHead = await this.systemConfigService.getSystemConfigHead(systemConfigHeadId);
        this.setHead(systemConfigHead);
        const systemConfigMxList = await this.systemConfigService.getSystemConfigMx(systemConfigHeadId);
        for (let i = 0; i < systemConfigMxList.length; i++) {
            const systemConfigMx = systemConfigMxList[i];
            this.setSystemConfigMx(systemConfigMx.systemConfigOptionId, systemConfigMx.systemConfigOptionMxId)
        }
    }

    public can(systemConfigOptionId: number, systemConfigOptionMxId: number): boolean {
        const systemConfigOptionMxId_now: number = this.systemConfigMxMap.get(systemConfigOptionId);
        return systemConfigOptionMxId === systemConfigOptionMxId_now
    }

    public editSystemConfig(systemConfigOptionId: number,systemConfigOptionMxId: number) {
        this.systemConfigMxMap.set(systemConfigOptionId,systemConfigOptionMxId);
    }

    private setHead(systemConfigHead: ISystemConfigHead) {
        this.systemConfigHeadId = systemConfigHead.systemConfigHeadId;
        this.systemConfigName = systemConfigHead.systemConfigName;
        this.createdAt = systemConfigHead.createdAt;
        this.creater = systemConfigHead.creater;
        this.updatedAt = systemConfigHead.updatedAt;
        this.updater = systemConfigHead.updater;
    }

    private setSystemConfigMx(systemConfigOptionId: number, systemConfigOptionMxId: number) {
        this.systemConfigMxMap.set(systemConfigOptionId, systemConfigOptionMxId)
    }
}