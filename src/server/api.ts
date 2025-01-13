import db from "@/mysql";
import { Request, Response, NextFunction } from "express";
import { ResultVO } from "@/types";

/**
 * @param req {description?, type, url, method, token?, model_id, model_name}
 */
export const createApi = (req: Request, res: Response, next: NextFunction) => {
    const select = 'select * from api where url = ? and method = ?'
    const resultVO: ResultVO = {
        code: 200,
        message: '创建成功',
        data: null
    }
    db.query(select, [req.query.url, req.query.method], (err, result) => {
        if(err) return next(err)
        if(result.length) return res.json({ ...resultVO, message: '接口已存在', code: 400 })
        const insert = 'insert into api(description, task_id, url, method, token, model_id, model_name, api_key) values(?, ?, ?, ?, ?, ?, ?, ?)'
        const description = req.query.description || ''
        const token = req.query.token || ''
        const api_key = req.query.api_key || ''
        const { task_id, url, method, model_id, model_name } = req.query
        db.query(insert, [description, task_id, url, method, token, model_id, model_name, api_key], (err, result) => {
            if(err) return next(err)
            res.json({ ...resultVO, data: result })
        })
    })
}

export const getApiList = (req: Request, res: Response, next: NextFunction) => {
    const select = `select a.id, a.url, a.description, a.token, a.api_key, a.method, 
    a.model_name, a.model_id, t.name as task_name, t.id as task_id 
    from api a, task t where a.task_id = t.id`
    db.query(select, (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '查询成功',
            data: result
        }
        res.json(resultVO)
    })
}

export const getApiById = (req: Request, res: Response, next: NextFunction) => {
    const select = `select a.id, a.url, a.description, a.token, a.api_key, a.method, 
    a.model_name, a.model_id, t.name as task_name, t.id as task_id, t.name as task_name 
    from api a, task t where a.task_id = t.id and a.id = ?`
    db.query(select, [req.query.id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '查询成功',
            data: result[0]
        }
        res.json(resultVO)
    })
}

export const updateApiById = (req: Request, res: Response, next: NextFunction) => {
    const { id, url, method, model_id, model_name, task_id } = req.body
    const update = `update api set url = ?, method = ?, model_id = ?, model_name = ?, task_id = ?, 
    description = ?, api_key = ?, token = ? where id = ?`
    const description = req.body.description || ''
    const token = req.body.token || ''
    const api_key = req.body.api_key
    db.query(update, [url, method, model_id, model_name, task_id, description, api_key, token, id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '更新成功',
            data: result
        }
        res.json(resultVO)
    })
}

export const deleteApiById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query
    const del = 'delete from api where id = ?'
    db.query(del, [id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '删除成功',
            data: result
        }
        res.json(resultVO)
    })
}