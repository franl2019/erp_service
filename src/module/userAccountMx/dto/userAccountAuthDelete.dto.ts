import {IsInt} from "class-validator";


export class UserAccountAuthDeleteDto {
    @IsInt()
    userid: number;
    @IsInt()
    accountId: number
}