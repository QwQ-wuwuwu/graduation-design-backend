import mysql, { ConnectionConfig } from 'mysql'

const config: ConnectionConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT) || 3306,
}

const db = mysql.createPool(config)

export default db