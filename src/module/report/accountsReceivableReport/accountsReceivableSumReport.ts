export interface IAccountsReceivableSumReport {
    correlationId:number;
    correlationType:number;
    openQty:number;
    receivables:number;
    actuallyReceived:number;
    endingBalance:number;
    abstract:string;
    reMark:string;
    inDate:Date | null;
    clientid:number;
    clientcode:string;
    clientname:string;
    ymrep:string;
}


