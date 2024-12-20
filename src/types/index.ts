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

export interface API {
    id?: number,
    description?: string,
    type: string,
    url: string,
    method: string,
    token?: string,
    insert_time?: Date,
    update_time?: Date
}