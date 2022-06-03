import { IsInt } from "class-validator";

export class DeleteProductDto {
  @IsInt()
  productid: number;
}