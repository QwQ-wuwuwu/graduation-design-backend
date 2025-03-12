import db from "@/mysql";
import { ResultVO } from "@/types";
import { Request, Response, NextFunction } from "express";

/**
 * @param req {name, description?, context?, max_output?}
 */
export const createModel = (req: Request, res: Response, next: NextFunction) => {
    const { name, server_from } = req.query
    const resultVO: ResultVO = {
        code: 200,
        message: '创建成功',
        data: null
    }
    const select = 'select * from model where name = ?'
    db.query(select, [name], (err, result) => {
        if(err) return next(err)
        if(result.length) return res.json({ ...resultVO, message: '模型已存在', code: 400 })
        const insert = 'insert into model(name, description, server_from, context, max_output) values(?, ?, ?, ?, ?)'
        const description = req.query.description || ''
        const context = req.query.context || ''
        const max_output = req.query.max_output || ''
        db.query(insert, [name, description, server_from, context, max_output], (err, result) => {
            if(err) return next(err)
            res.json({ ...resultVO, data: result })
        })
    })
}

export const getModelList = (req: Request, res: Response, next: NextFunction) => {
    const select = 'select * from model'
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

/**
 * @param req {id}
 */
export const getModelById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query
    const select = 'select * from model where id = ?'
    db.query(select, [id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '查询成功',
            data: result[0]
        }
        res.json(resultVO)
    })
}

export const updateModelById = (req: Request, res: Response, next: NextFunction) => {
    const { id, name } = req.body
    const description = req.body.description || ''
    const context = req.body.context || ''
    const max_output = req.body.max_output || ''
    const update = 'update model set name = ?, description = ?, context = ?, max_output = ? where id = ?'
    db.query(update, [name, description, context, max_output, id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '模型更新成功',
            data: result
        }
        res.json(resultVO)
    })
}

export const deleteModelById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query
    const del = 'delete from model where id = ?'
    db.query(del, [id], (err, result) => {
        if(err) return next(err)
        const resultVO: ResultVO = {
            code: 200,
            message: '模型删除成功',
            data: result
        }
        res.json(resultVO)
    })
}