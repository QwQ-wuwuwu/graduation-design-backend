import { Router } from "express";
import {
    createAssistant,
    updateAssistant,
    getOnlineAssistants,
    getAssistants
} from "@/server/assistant";

const assistantRouter = Router();

assistantRouter.post('/create', createAssistant);
assistantRouter.post('/update', updateAssistant)
assistantRouter.get('/list', getOnlineAssistants)
assistantRouter.get('/build_list', getAssistants)

export default assistantRouter;