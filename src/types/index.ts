export interface User {
    id?: number,
    name: string,
    password?: string,
    role?: number,
    user_group?: string
}

export interface ResultVO {
    code: number,
    message: string,
    data: any
}