import {IsInt, NotEquals} from "class-validator";

export class FindOneBuyDto {

    @IsInt()
    @NotEquals(0)
    buyid:number;
}