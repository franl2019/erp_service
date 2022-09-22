import {ISystemConfigMx} from "../systemConfigMx";
import {IsArray, IsDate, IsInt, IsString, NotEquals} from "class-validator";

export class SystemConfigMxUpdateListDto {
    @IsArray()
    systemConfigMxUpdateList: SystemConfigMxUpdateDto[]
}

export class SystemConfigMxUpdateDto implements ISystemConfigMx {
    //账套配置单头id
    @IsInt()
    @NotEquals(0)
    systemConfigHeadId: number;
    //账套配置项id
    @IsInt()
    @NotEquals(0)
    systemConfigOptionId: number;
    //账套配置项选中明细id
    @IsInt()
    @NotEquals(0)
    systemConfigOptionMxId: number;

    @IsString()
    updater: string | null;

    @IsDate()
    updatedAt: Date | null;


    constructor(systemConfigMxUpdateDto: ISystemConfigMx) {
        this.systemConfigHeadId = systemConfigMxUpdateDto.systemConfigHeadId;
        this.systemConfigOptionId = systemConfigMxUpdateDto.systemConfigOptionId;
        this.systemConfigOptionMxId = systemConfigMxUpdateDto.systemConfigOptionMxId;
        this.updater = systemConfigMxUpdateDto.updater;
        this.updatedAt = systemConfigMxUpdateDto.updatedAt;
    }
}