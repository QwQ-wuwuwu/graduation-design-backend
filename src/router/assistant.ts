import { Router } from "express";
import {
    createAssistant,
    updateAssistant
} from "@/server/assistant";

const assistantRouter = Router();

assistantRouter.post('/create', createAssistant);
assistantRouter.post('/update', updateAssistant)

export default assistantRouter;