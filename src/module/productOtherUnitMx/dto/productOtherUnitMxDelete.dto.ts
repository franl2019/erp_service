import {IsInt, NotEquals} from "class-validator";

export class ProductOtherUnitMxDeleteDto {
    @IsInt()
    @NotEquals(0)
    productid:number;

    @IsInt()
    @NotEquals(0)
    productOtherUnitId: number;
}