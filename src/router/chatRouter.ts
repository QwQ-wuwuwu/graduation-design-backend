import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import SSEParse from "@/util/SSEParse";
import { 
    relationContext, 
    addChatHistory,
    getChatHistory
} from "@/server/chat";

const chatRouter = Router();

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

    const { userId, assistantId, applicationId } = req.query;
    const result: any[] = await relationContext(15, {
        user_id: parseInt(userId as string),
        assis_id: parseInt(assistantId as string)
    })
    const prompt = result.map((item: any) => {
        return {
            role: item.message.role,
            content: item.message.content
        }
    })
    console.log('prompt', prompt);
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

        parser.on('event', (event) => {
            if (event.event === 'finish') {
                const prompt = {
                    'role': 'assistant',
                    'content': event.data
                }
                addChatHistory({
                    user_id: parseInt(userId as string),
                    assis_id: parseInt(assistantId as string),
                    content: prompt
                })
            }
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        })
    } catch (error) {
        res.status(200).send('Internal Server Error');
    } finally {
        
    }
})

chatRouter.get('/messagelist', async (req: Request, res: Response) => {
    const { userId, assistantId } = req.query;
    const result = await getChatHistory(userId as string, assistantId as string);
    res.json({
        code: 200,
        message: '获取成功',
        data: result
    });
})

export default chatRouter;