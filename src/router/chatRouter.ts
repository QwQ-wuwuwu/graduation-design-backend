import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import SSEParse from "@/util/SSEParse";

const chatRouter = Router();

const sessionMap = new Map<string, any>();

// 走这个接口的都是调用大模型接口创建的助手
chatRouter.post('/init', async (req: Request, res: Response) => {
    const { api_key, app_id, prompt } = req.body;
    const sessionId = (new Date()).getTime().toString();
    sessionMap.set(sessionId, {
        api_key,
        app_id,
        prompt,
    });
    res.json({
        code: 200,
        message: '',
        data: {
            sessionId,
        }
    });
})

chatRouter.get('/stream', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { sessionId } = req.query;
    const { api_key, app_id, prompt } = sessionMap.get(sessionId as string);
    const url = `https://open.bigmodel.cn/api/llm-application/open/model-api/${app_id}/sse-invoke`;
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

        parser.on('event', (event) => {
            // console.log(event);
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        })
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send('Internal Server Error');
    } finally {
        sessionMap.delete(sessionId as string);
    }
})

export default chatRouter;