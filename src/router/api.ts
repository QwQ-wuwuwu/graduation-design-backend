import { Router } from "express";
import { createApi, getApiList, deleteApiById, getApiById, updateApiById } from "@/server/api";

const router = Router();

router.post('/create', createApi)
router.get('/list', getApiList)
router.delete('/delete', deleteApiById)
router.get('', getApiById)
router.post('/update', updateApiById)

export default router;