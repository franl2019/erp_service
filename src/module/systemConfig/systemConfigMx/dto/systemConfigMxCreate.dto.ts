import {ISystemConfigMx} from "../systemConfigMx";
import {IsInt, NotEquals} from "class-validator";

export class SystemConfigMxCreateDto implements ISystemConfigMx {
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

    updater: string | null;
    updatedAt: Date | null;
}