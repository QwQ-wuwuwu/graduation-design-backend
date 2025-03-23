import db from '@/mysql';
import { Request, Response, NextFunction } from 'express';

export const createKnowledge = (req: Request, res: Response, next: NextFunction) => {
    const select = 'select * from knowledge where name = ?';
    const { name } = req.body;
    db.query(select, [name], (err, result) => {
        if(err) return next(err);
        if(result.length > 0) {
            return res.json({ code: 400, message: '知识库已存在', data: null });
        }
        const insert = `insert into knowledge(type, name, description, model_id, user_id) values(?, ?, ?, ?, ?)`;
        const { type, name, model_id, user_id } = req.body
        const description = req.body.description || ''
        db.query(insert, [type, name, description, model_id, user_id], (err, result) => {
            if(err) return next(err);
            res.json({ code: 200, message: '创建成功', data: result });
        })
    })
}

export const getKnowledgeList = (req: Request, res: Response, next: NextFunction) => {
    const { type, user_id } = req.query;
    const select = `select k.*, u.name as user_name, m.name as model_name 
        from knowledge k 
        join user u on u.id = k.user_id 
        join model m on m.id = k.model_id
        where k.type = ? and k.user_id = ?`;
    db.query(select, [type, user_id], (err, result) => {
        if(err) return next(err);
        res.json({ code: 200, message: '查询成功', data: result });
    })
}

// 获取简略信息的知识库列表
export const getList = (req: Request, res: Response, next: NextFunction) => {
    const select = `select id, name from knowledge`
    db.query(select, [], (err, result) => {
        if(err) return next(err)
        res.json({
            code: 200,
            message: '',
            data: result
        })
    })
}

export const getKnowledgeById = (req: Request, res: Response, next: NextFunction) => {
    const select = `select k.*, u.name as user_name, m.name as model_name 
        from knowledge k 
        join user u on u.id = k.user_id 
        join model m on m.id = k.model_id 
        where k.id = ?`
    db.query(select, [req.query.id], (err, result) => {
        if(err) return next(err);
        res.json({ code: 200, message: '查询成功', data: result[0] });
    })
}


export const uploadDocKnowledges = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.files);
    console.log('run to uploadDocKnowledge')
    res.json({ code: 200, message: '上传成功', data: req.files });
}

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.file);
    res.json({ code: 200, message: '上传成功', data: req.files });
}
