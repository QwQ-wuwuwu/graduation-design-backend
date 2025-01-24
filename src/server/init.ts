import db from "@/mysql";
import fs from "fs";

export default async function init() {
    fs.readFile('schema.sql', 'utf8', (err, data) => {
        if(err) return err
        console.log('data', JSON.stringify(data))
    })
}