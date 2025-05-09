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
    const { id, portrait, api_id, model_id, model_name, on_off, temperature, max_token } = req.body
    const knowledge_ids = req.body.knowledge_ids || '' // '1,2,3'
    const guide_word = req.body.guide_word || ''
    const param_desc = req.body.param_desc || ''
    const flow_limit = 15 // 每日流量限制
    const update = `update assistant set 
        portrait = ?, api_id = ?, model_id = ?, model_name = ?, 
        temperature = ?, max_token = ?, param_desc = ?, flow_limit = ?, 
        knowledge_ids = ?, guide_word = ?, on_off = ? 
        where id = ?`
    db.query(update, 
        [portrait, api_id, model_id, temperature, max_token, param_desc, flow_limit, knowledge_ids, guide_word, on_off, id],
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

// 聊天助手信息
export const chatWithAssistant = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query
    const select = `select ass.*, a.url, a.token, a.api_key, a.method, m.name as model_name 
        from assistant ass 
        join api a on a.id = ass.api_id 
        join model m on ass.model_id = m.id
        where ass.id = ?`
    db.query(select, [id], (err, result) => {
        if(err) return next(err)
        res.json({ code: 200, message: '获取成功', data: result[0] })
    })
}

export const getAssistantDetail = async (id: string) => {
    const preSelect = `select * from assistant where id = ?`
    const preResult: any = await new Promise((resolve, reject) => {
        db.query(preSelect, [id], (err, result) => {
            if(err) return reject(err)
            resolve(result[0])
        })
    })
    if (!preResult.api_id) {
        return preResult
    }
    const select = `select ass.*, a.task_name 
        from assistant ass 
        join api a on a.id = ass.api_id 
        where ass.id = ?`;
    return new Promise((resolve, reject) => {
        db.query(select, [id], (err, result) => {
            if(err) return reject(err)
            console.log(result)
            resolve(result[0])
        })
    })
}