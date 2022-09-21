import {IsInt, NotEquals} from "class-validator";

export class SystemConfigOptionMxDeleteDto{
    //账套配置项明细选择id
    @IsInt()
    @NotEquals(0)
    systemConfigOptionMxId:number;
}