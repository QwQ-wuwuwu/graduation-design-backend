import { Router, Request, Response } from "express";
import {
    createAssistant,
    updateAssistant,
    getOnlineAssistants,
    getAssistants,
    chatWithAssistant,
    getAssistantDetail
} from "@/server/assistant";

const assistantRouter = Router();

assistantRouter.post('/create', createAssistant);
assistantRouter.post('/update', updateAssistant)
assistantRouter.get('/list', getOnlineAssistants)
assistantRouter.get('/build_list', getAssistants)
assistantRouter.get('/chat', chatWithAssistant)

assistantRouter.get('/detail', async (req: Request, res: Response) => {
    const { id } = req.query
    const detail = await getAssistantDetail(id as string)
    res.json({ code: 200, message: '获取成功', data: detail })
})

export default assistantRouter;