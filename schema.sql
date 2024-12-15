-- Active: 1733314319221@@localhost@3306@zgj
DROP DATABASE IF EXISTS `zgj`;
CREATE DATABASE IF NOT EXISTS `zgj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `zgj`;
CREATE Table if NOT exists `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    role_name VARCHAR(255) UNIQUE,
    user_group VARCHAR(255) NOT NULL,
    meun JSON,
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* 助手信息表 */
CREATE Table if NOT exists `assistant` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* 用户与助手多对多映射表 */
CREATE Table if NOT exists `user_assis` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assis_id INT NOT NULL,
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (assis_id) REFERENCES `assistant`(id)
);

/* 历史会话与用户，助手多对多映射表 */
CREATE Table if NOT exists `chat_history` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assis_id INT NOT NULL,
    message TEXT,
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (assis_id) REFERENCES `assistant`(id)
)