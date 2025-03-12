import db from "@/mysql";
import { Request, Response, NextFunction } from "express";

export const createAssistant = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
    const select = 'select * from assistant where name = ?'
    db.query(select, [name], (err, result) => {
        if(err) return next(err)
        if(result.length > 0) return res.json({ code: 400, message: '助手已存在' })
        const { description, avatar, user_name, user_id } = req.body
        const insert = 'insert into assistant(name, description, avatar, user_name, user_id) values(?, ?, ?, ?, ?)'
        db.query(insert, [name, description, avatar, user_name, user_id], (err, result) => {
            if(err) return next(err)
            res.json({ code: 200, message: '创建成功', data: result })
        })
    })
}

export const updateAssistant = (req: Request, res: Response, next: NextFunction) => {
    
}