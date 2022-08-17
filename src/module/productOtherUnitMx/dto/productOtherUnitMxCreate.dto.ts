import {IProductOtherUnitMx} from "../productOtherUnitMx";
import {IsInt, NotEquals} from "class-validator";

export class ProductOtherUnitMxCreateDto implements IProductOtherUnitMx{

    @IsInt()
    @NotEquals(0)
    productOtherUnitId: number;

    @IsInt()
    @NotEquals(0)
    productid: number;

    @IsInt()
    @NotEquals(0)
    conversionRate: number;

    creater: string;
    createdAt: Date;
}