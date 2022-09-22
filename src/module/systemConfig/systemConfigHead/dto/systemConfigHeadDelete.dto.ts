import {IsInt, NotEquals} from "class-validator";

export class SystemConfigHeadDeleteDto{
    //账套单头id
    @IsInt()
    @NotEquals(0)
    systemConfigHeadId: number
}