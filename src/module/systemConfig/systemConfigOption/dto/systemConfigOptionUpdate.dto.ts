import {ISystemConfigOption} from "../systemConfigOption";
import {IsInt, IsString, NotEquals} from "class-validator";

export class SystemConfigOptionUpdateDto implements ISystemConfigOption{
    //账套配置项id
    @IsInt()
    @NotEquals(0)
    systemConfigOptionId: number;
    //账套配置项名称
    @IsString()
    systemConfigOptionName: string;
    //账套配置项备注
    @IsString()
    reMark: string;
    creater: string;
    createdAt: Date;
    updater: string | null;
    updatedAt: Date | null;
    del_uuid: number | null;
    deleter: string | null;
    deletedAt: Date | null;
}