export function useGetSqlString(tableName:string,obj:any){
    let sql = '';
    for (const key in obj) {
        sql = sql + `${tableName}.${key},`
    }
    sql = sql.slice(0,sql.length-1);
    return sql
}