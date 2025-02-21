import { Router } from "express";
import {
    createAssistant
} from "@/server/assistant";

const assistantRouter = Router();

assistantRouter.post('/create', createAssistant);

export default assistantRouter;