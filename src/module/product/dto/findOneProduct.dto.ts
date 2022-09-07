import {IsInt} from "class-validator";

export class FindOneProductDto {

    @IsInt()
    productid:number
}