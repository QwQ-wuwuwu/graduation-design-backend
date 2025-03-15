import db from "@/mysql";
import { Request, Response, NextFunction } from "express";

export const createAssistant = (req: Request, res: Response, next: NextFunction) => {
    const { name, user_id } = req.body
    const select = 'select * from assistant where name = ? and user_id = ?'
    db.query(select, [name, user_id], (err, result) => {
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

// 保存配置或者上线助手
export const updateAssistant = (req: Request, res: Response, next: NextFunction) => {
    const { id, portrait, api_id, model_id, on_off, temperature, max_token } = req.body
    const knowledge_ids = req.body.knowledge_ids || '' // '1,2,3'
    const guide_word = req.body.guide_word || ''
    const update = `update assistant set 
        portrait = ?, api_id = ?, model_id = ?, 
        temperature = ?, max_token = ?, 
        knowledge_ids = ?, guide_word = ?, on_off = ? 
        where id = ?`
    db.query(update, 
        [portrait, api_id, model_id, temperature, max_token, knowledge_ids, guide_word, on_off, id],
        (err, result) => {
            if(err) return next(err)
            res.json({ code: 200, message: '更新成功', data: result })
        })
}

// 获取已上线的平台预置的或者用户创建的助手列表
export const getOnlineAssistants = (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.query
    const select = `select * from assistant where user_id = ? and on_off = 1
        union
        select * from assistant where user_name = ? and on_off = 1`
    // union 合并两次查询的结果并自动去重，避免 or 查询效率低的问题
    db.query(select, [user_id, 'admin'], (err, result) => {
        if(err) return next(err)
        res.json({ code: 200, message: '获取成功', data: result })
    })
}

// 构建页面的助手
export const getAssistants = (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.query
    const select = `select * from assistant where user_id = ? 
        union 
        select * from assistant where user_name = ?`
    db.query(select, [user_id, 'admin'], (err, result) => {
        if(err) return next(err)
        res.json({
            code: 200,
            message: '获取成功',
            data: result
        })
    })
}