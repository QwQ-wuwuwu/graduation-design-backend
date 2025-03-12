import db from "@/mysql";
import { Request, Response, NextFunction } from "express";

export const createTask = (req: Request, res: Response, next: NextFunction) => {
    const { name, model_id } = req.body
    const select = 'select * from task where name = ? and model_id = ?'
    const resultVO = {
        code: 200,
        message: '创建成功',
        data: null
    }
    db.query(select, [name, model_id], (err, result) => {
        if(err) return next(err)
        if(result.length) return res.json({ ...resultVO, message: '任务已存在', code: 400 })
        const insert = 'insert into task(name, model_id, description) values(?, ?, ?)'
        const { description } = req.body || ''
        db.query(insert, [name, model_id, description], (err, result) => {
            if(err) return next(err)
            res.json({ ...resultVO, data: result })
        })
    })
}

export const getTaskList = (req: Request, res: Response, next: NextFunction) => {
    const select = 'select t.id, t.name, m.name as model_name, t.description from task t, model m where t.model_id = m.id'
    db.query(select, (err, result) => {
        if(err) return next(err)
        const resultVO = {
            code: 200,
            message: '查询成功',
            data: result
        }
        res.json(resultVO)
    })
}

export const getTaskById = (req: Request, res: Response, next: NextFunction) => {
    const select = 'select t.id, t.name, m.id as model_id, m.name as model_name, t.description from task t, model m where t.model_id = m.id and t.id = ?'
    db.query(select, [req.query.id], (err, result) => {
        if(err) return next(err)
        const resultVO = {
            code: 200,
            message: '查询成功',
            data: result[0]
        }
        res.json(resultVO)
    })
}

export const updateTaskById = (req: Request, res: Response, next: NextFunction) => {
    const { name, model_id, id } = req.body
    const update = 'update task set name = ?, model_id = ? where id = ?'
    db.query(update, [name, model_id, id], (err, result) => {
        if(err) return next(err)
        const resultVO = {
            code: 200,
            message: '更新成功',
            data: result
        }
        res.json(resultVO)
    })
}

export const deleteTaskById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query
    const del = 'delete from task where id = ?'
    db.query(del, [id], (err, result) => {
        if(err) return next(err)
        const resultVO = {
            code: 200,
            message: '删除成功',
            data: result
        }
        res.json(resultVO)
    })
}

// 后期优化为分页请求
export const searchTaskByName = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query
    if(!name) {
        res.json({
            code: 400,
            message: '搜索条件不能为空或者空白字符',
            data: null
        })
    }
    const select = `select t.id, t.name, m.name as model_name, t.description 
    from task t, model m 
    where t.model_id = m.id and t.name like ?
    order by t.name asc`
    const searchName = `%${name}%`
    db.query(select, [searchName], (err, result) => {
        if(err) return next(err)
        const resultVO = {
            code: 200,
            message: '查询成功',
            data: result
        }
        res.json(resultVO)
    })
}