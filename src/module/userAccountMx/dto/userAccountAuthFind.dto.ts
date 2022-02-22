import {IsInt} from "class-validator";


export class UserAccountAuthFindDto {
    @IsInt()
    userid: number;
    @IsInt()
    accountId: number
}