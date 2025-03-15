import express, { Request, Response } from 'express';
import cors from 'cors';
import userRouter from './router/user'
import { decode } from './jwt/index'
import { initServer } from './server/user'
import apiRouter from '@/router/api'
import modelRouter from './router/model';
import taskRouter from './router/task';
import { readTable } from '@/server/init'
import knowledgeRouter from './router/knowledge';
import assistantRouter from './router/assistant';

const port = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(decode())

app.use('/api/user', userRouter)
app.use('/api/url', apiRouter)
app.use('/api/model', modelRouter)
app.use('/api/task', taskRouter)
app.use('/api/knowledge', knowledgeRouter)
app.use('/api/assistant', assistantRouter)

app.use((err: any, req: Request, res: Response) => {
    if(err.name === 'UnauthorizedError') { // token验证失败
        res.status(401).send('invalid token...')
    }
    if(err.code === 'ER_DUP_ENTRY') {
        res.status(500).send('插入数据时违反主键约束')
    }
    if(err.code === 'ER_PARSE_ERROR') {
        res.status(500).send('查询语句拼写错误或参数错误');
    }
    if(err.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(500).send('外键约束错误');
    }
    res.status(500).send('服务器异常，请稍后再试');
})

app.listen(port, () => {
    initServer()
    // sqlInit()
    // readTable('api.txt', 'api')
    // taskInit()
    console.log(`Server is running on port ${port}`);
})