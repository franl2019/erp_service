import {IsInt} from "class-validator";

export class DeleteAccountDto {
    @IsInt()
    accountId:number;
}