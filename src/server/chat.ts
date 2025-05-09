import db from "@/mysql";

type ChatData = {
    user_id: number;
    assis_id: number;
    content: string;
    attachments?: string;
}

export const relationContext = (count = 14, chatData: ChatData) => {
    const { user_id, assis_id, content } = chatData;
    const attachments = chatData.attachments || '';
    const strContent = JSON.stringify(content);
    const insert = `insert into chat_history(user_id, assis_id, message, attachment) values(?, ?, ?, ?)`;
    const select = `select * from chat_history 
        where user_id = ? and assis_id = ? 
        order by create_time desc 
        limit ${count}`;
    db.query(insert, [user_id, assis_id, strContent, attachments], (err, result) => {
        if (err) return err;
        db.query(select, [user_id, assis_id], (err, result) => {
            if (err) return err;
            console.log(result);
            return result.map((item: any) => ({ ...item, message: JSON.parse(item.message) }));
        })
    })
}