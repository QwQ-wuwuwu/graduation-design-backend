import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import { User } from '../types/index'

const secretKey = process.env.SECRET_KEY as string

export const encode = (user: User) => {
    return jwt.sign(
        user,
        secretKey,
        { expiresIn: '24h' }
    )
}

export const decode = () => {
    return expressjwt(
        { secret: secretKey, algorithms: ['HS256'] })
        .unless(
            { path: [
                '/api/user/login', 
                '/api/user/register',
                '/api/chat/stream',
            ] }
        )
}