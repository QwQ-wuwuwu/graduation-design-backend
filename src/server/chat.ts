import db from "@/mysql";

type ChatData = {
    user_id: number;
    assis_id: number;
    content?: any;
    attachments?: string;
}

// 添加聊天历史记录
export const addChatHistory = async (chatData: ChatData) => {
    const { user_id, assis_id, content } = chatData;
    const attachments = chatData.attachments || '';
    const strContent = JSON.stringify(content);
    const insert = `insert into chat_history(user_id, assis_id, message, attachment) values(?, ?, ?, ?)`;
    return await new Promise((resolve, reject) => {
        db.query(insert, [user_id, assis_id, strContent, attachments], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

// 获取调用大模型接口创建的应用聊天上下文
export const relationContext = async (count = 15, chatData: ChatData): Promise<any[]> => {
    const { user_id, assis_id } = chatData;
    const select = `select * from chat_history 
        where user_id = ? and assis_id = ? 
        order by insert_time 
        limit ${count}`;
    return await new Promise((resolve, reject) => {
        db.query(select, [user_id, assis_id], (err, result) => {
            if (err) reject(err);
            resolve(result.map((item: any) => ({ ...item, message: JSON.parse(item.message) })))
        })
    })
}

// 获取助手聊天记录
export const getChatHistory = async (user_id: string, assis_id: string) => {
    const select = `select * from chat_history
        where user_id = ? and assis_id = ?`
    return await new Promise((resolve, reject) => {
        db.query(select, [user_id, assis_id], (err, result) => {
            if (err) return reject(err)
            resolve(result.map((item: any) => ({ ...item, message: JSON.parse(item.message) })))
        })
    })
}