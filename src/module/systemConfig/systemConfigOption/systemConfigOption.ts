export interface ISystemConfigOption {
    //账套配置项id
    systemConfigOptionId: number;
    //账套配置项名称
    systemConfigOptionName: string;
    //账套配置项备注
    reMark: string;

    creater: string;
    createdAt: Date;
    updater: string | null;
    updatedAt: Date | null;
    del_uuid: number | null;
    deleter: string | null;
    deletedAt: Date | null;
}