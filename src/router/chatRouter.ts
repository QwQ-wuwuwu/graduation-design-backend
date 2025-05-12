import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import SSEParse from "@/util/SSEParse";
import { relationContext, addChatHistory } from "@/server/chat";

const chatRouter = Router();

const sessionMap = new Map<string, any>();

// 添加助手会话消息
chatRouter.post('/init', async (req: Request, res: Response) => {
    const { userId, prompt, assistantId } = req.body;
    const data = {
        user_id: userId,
        assis_id: assistantId,
        content: prompt
    }
    const result = await addChatHistory(data);
    res.json({
        code: 200,
        message: '',
        data: result
    });
})

const api_key = process.env.MODEL_TOKEN || '';
// 应用流式会话
chatRouter.get('/stream', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { applicationId } = req.query;
    const url = `https://open.bigmodel.cn/api/llm-application/open/model-api/${applicationId}/sse-invoke`;
    try {
        const modelResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify({
                prompt
            })
        })

        if (!modelResponse.ok) {
            throw new Error(`Model API error: ${modelResponse.status}`);
        }

        const reader = modelResponse.body;
        const parser = new SSEParse();

        reader?.on('data', (chunk: any) => {
            parser.feed(chunk.toString());
        })

        reader?.on('end', () => {
            res.end();
        })
        
        reader?.on('error', (error: any) => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        })

        let msg = '';
        parser.on('event', (event) => {
            msg += event.data;
            if (event.event === 'finish') {
                addChatHistory({
                    user_id: 0,
                    assis_id: 0,
                    content: msg
                })
            }
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        })
    } catch (error) {
        res.status(200).send('Internal Server Error');
    } finally {
        
    }
})

export default chatRouter;