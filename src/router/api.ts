import { Router } from "express";
import { createApi } from "@/server/api";

const router = Router();

router.post('/create', createApi)

export default router;