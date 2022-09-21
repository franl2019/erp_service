import {ISystemConfigOptionMx} from "../systemConfigOptionMx";
import {IsInt, IsString, NotEquals} from "class-validator";

export class SystemConfigOptionMxCreateDto implements ISystemConfigOptionMx{
    //账套配置项明细选择id
    systemConfigOptionMxId:number;
    //账套配置项明细选择名称
    @IsString()
    systemConfigOptionMxName:string
    //账套配置项id
    @IsInt()
    @NotEquals(0)
    systemConfigOptionId:number;
    //备注
    @IsString()
    reMark:string
}