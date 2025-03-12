import db from "@/mysql";
import fs from "fs";
import path from "path";

export async function init() {
    fs.readFile('schema.sql', 'utf8', (err, data) => {
        if(err) return err
        console.log('data', JSON.stringify(data))
    })
}

const file_path = path.resolve(__dirname, '../../files/table')

export async function readTable(file_name: string, table_name: string) {
    const select = `select * from ${table_name}`
    db.query(select, (err, result) => {
        if(err) return err
        // console.log('result', result)
        if(!fs.existsSync(file_path)) {
            fs.mkdirSync(file_path)
        }
        fs.writeFile(path.resolve(file_path, file_name), JSON.stringify(result), (err) => {
            if(err) return console.error(err)
            // console.log('写入成功')
        })
    })
}
