import {ISystemConfigHead} from "../systemConfigHead";
import {IsInt, IsString, NotEquals} from "class-validator";

export class SystemConfigHeadUpdateDto implements ISystemConfigHead{
    //账套单头id
    @IsInt()
    @NotEquals(0)
    systemConfigHeadId: number
    //账套名称
    @IsString()
    systemConfigName: string;

    creater: string;
    createdAt: Date;
    updater: string | null;
    updatedAt: Date | null;
    del_uuid: number
    deleter: string | null
    deletedAt: Date | null;
}