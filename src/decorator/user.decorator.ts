import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export interface IState {
    token: {
        userid: number;
    };
    user: {
        userid: number;
        username: string;
        roleIds:number[];
        systemConfigHeadId:number;
        buy_operateareaids: number[];
        client_operateareaids: number[];
        warehouseids: number[];
        accountIds: number[];
    }
}

export const ReqState = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.state;
    },
);