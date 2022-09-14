export interface ISystemConfigHead {
    //账套单头id
    systemConfigHeadId: number
    //账套名称
    systemConfigName: string;

    creater: string;
    createdAt: Date;
    updater: string | null;
    updatedAt: Date | null;
    del_uuid: number
    deleter: string | null
    deletedAt: Date | null;
}