import db from '../mysql/index'
import { encode } from '../jwt/index'
import { decrypt } from '../util/index'
import { Request, Response, NextFunction } from 'express'
import { ResultVO } from '@/types'

export const initServer = () => {
    const select = 'select * from user where name = ?'
    db.query(select, ['admin'], (err, result) => {
        if(err) throw err
        if(result.length) return console.log('管理员账号已存在')
        const insert = 'insert into user(name, password, role, user_group) values(?, ?, ?, ?)'
        const password = process.env.ADMIN_PASSWORD || 'admin'
        db.query(insert, ['admin', password, 0, 'default'], (err, result) => {
            if(err) throw err
            console.log('管理员账号初始化成功', result[0])
        })
    })
}

/**
 * @param req {name, password}
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const select = `select * from user where name = ?`
    db.query(select, [req.body.name], (err, result) => {
        if(err) return next(err)
        if(result.length) return res.json({
            code: 400,
            message: '用户名已存在',
            data: null
        })
        const insert = 'insert into user(name, password, role, user_group) values(?, ?, ?, ?)'
        const password = decrypt(req.body.password, process.env.SECRET_KEY as string) 
        db.query(insert, [req.body.name, password, 2, "默认用户组"], (err, result) => {
            if(err) return next(err)
            const resultVO: ResultVO = {
                code: 200,
                message: '注册成功',
                data: null
            }
            res.json(resultVO)
        })
    })
}

/**
 * @param req {name, password}
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const password = decrypt(req.body.password, process.env.SECRET_KEY as string)
    const select = 'select * from user where name = ? and password = ?'
    db.query(select, [req.body.name, password], (err, result) => {
        if(err) return next(err)
        if(!result.length) return res.json({
            code: 400,
            message: '用户名或密码错误',
            data: null
        })
        const user = { ...result[0], password: ''}
        const token = encode({ name: user.name, role: user.role })
        res.setHeader('Authorization', `Bearer ${token}`)
        res.json({
            code: 200,
            message: '登录成功',
            data: user,
            token
        })
    })
}