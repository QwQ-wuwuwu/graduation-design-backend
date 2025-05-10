import { Router, Request, Response } from "express";
import { 
    createKnowledge,
    getKnowledgeList,
    getKnowledgeById,
    uploadDocKnowledges,
    uploadFile,
    getList,
    getKnowledgeIds
} from '@/server/knowledge'
import multer from 'multer';
import path from 'path';
import fs from 'node:fs';

const file_path = process.env.File_PATH || path.resolve(__dirname, '../../files/knowledge');
const knowledgeRouter = Router();

knowledgeRouter.post('/create', createKnowledge)
knowledgeRouter.get('/list', getKnowledgeList)
knowledgeRouter.get('/slist', getList)
knowledgeRouter.get('', getKnowledgeById)

const storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(file_path)) {
            fs.mkdirSync(file_path, { recursive: true })
        }
        cb(null, file_path)
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const files = fs.readdirSync(file_path)
        if(files.includes(fileName)) return console.log('文件已存在')
    },
    filename: function (req, file, cb) {
        const utf8FileName = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        cb(null, utf8FileName)
    }
})
const upload = multer({ storage: storageFile })

// 多文件上传
knowledgeRouter.post('/upload_files', upload.array('files'), uploadDocKnowledges)

// 单文件上传
knowledgeRouter.post(`/upload`, upload.single('file'), uploadFile)

// 获取真实向量知识库 id
knowledgeRouter.get('/ids', async (req: Request, res: Response) => {
    const { ids } = req.query
    const idsArray = ids?.toString().split(',').map(id => Number(id)) || []
    const result = await getKnowledgeIds(idsArray)
    res.json({
        code: 200,
        message: '获取成功',
        data: result
    })
})

export default knowledgeRouter;