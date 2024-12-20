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
        const insert = 'insert into api(description, type, url, method, token, model_id, model_name) values(?, ?, ?, ?, ?, ?, ?)'
        const description = req.query.description || ''
        const token = req.query.token || ''
        const { type, url, method, model_id, model_name } = req.query
        db.query(insert, [description, type, url, method, token, model_id, model_name], (err, result) => {
            if(err) return next(err)
            res.json({ ...resultVO, data: result })
        })
    })
}