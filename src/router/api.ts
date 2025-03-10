import { Router } from "express";
import {  
    createApi, 
    getApiList,
    deleteApiById, 
    getApiById, 
    updateApiById,
    getTasks,
    getTaskByModel 
} from "@/server/api";

const router = Router();

router.post('/create', createApi)
router.get('/list', getApiList)
router.delete('/delete', deleteApiById)
router.get('', getApiById)
router.post('/update', updateApiById)
router.get('/tasks', getTasks)
router.get('/task', getTaskByModel)

export default router;