import {ISystemConfigHead} from "../systemConfigHead";
import {IsString} from "class-validator";

export class SystemConfigHeadCreateDto implements ISystemConfigHead{
    //账套单头id
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