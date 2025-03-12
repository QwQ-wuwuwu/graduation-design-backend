import express from 'express'
import {
    createTask,
    getTaskList,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    searchTaskByName
} from '@/server/task'

const taskRouter = express.Router()

taskRouter.post('/create', createTask)
taskRouter.get('/list', getTaskList)
taskRouter.get('', getTaskById)
taskRouter.post('/update', updateTaskById)
taskRouter.delete('/delete', deleteTaskById)
taskRouter.get('/search', searchTaskByName)

export default taskRouter