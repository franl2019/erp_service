export interface IState {
    token: {
        userid: number;
    };
    user: {
        userid: number;
        username: string;
        buy_operateareaids: number[];
        client_operateareaids: number[];
        warehouseids: number[];
        accountIds: number[];
    }
}

export class State implements IState {
    token: {
        userid: number;
    };
    user: {
        userid: number;
        username: string;
        buy_operateareaids: number[];
        client_operateareaids: number[];
        warehouseids: number[];
        accountIds: number[];
    };
}

