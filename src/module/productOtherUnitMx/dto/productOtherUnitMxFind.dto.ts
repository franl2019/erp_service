import {IsInt, NotEquals} from "class-validator";

export class ProductOtherUnitMxFindDto {

    @IsInt()
    @NotEquals(0)
    productid:number;
}