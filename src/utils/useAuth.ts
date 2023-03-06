export function isExistAuth(id: number, authIdList: number[]) {
    return authIdList.includes(id)
}