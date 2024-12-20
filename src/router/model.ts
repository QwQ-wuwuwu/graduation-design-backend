import express from 'express'
import { 
    createModel, 
    getModelList,
    getModelById,
    updateModelById,
    deleteModelById
} from '@/server/model'
import { mode } from 'crypto-js'

const modelRouter = express.Router()

modelRouter.post('/create', createModel)
modelRouter.get('/list', getModelList)
modelRouter.get('', getModelById)
modelRouter.post('/update', updateModelById)
modelRouter.delete('/delete', deleteModelById)

export default modelRouter