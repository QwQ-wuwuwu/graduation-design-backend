-- Active: 1734421393583@@101.200.220.142@3306@graduation

DROP DATABASE IF EXISTS `graduation`;
CREATE DATABASE IF NOT EXISTS `graduation` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `graduation`;

/* 测试开发环境 */
/* DROP DATABASE IF EXISTS `zgj`;
CREATE DATABASE IF NOT EXISTS `zgj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `zgj`; */
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
    user_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    /* 头像颜色 */
    avatar VARCHAR(20),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* 助手配置表 */
CREATE Table if NOT exists `assis_config` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assis_id INT NOT NULL,
    assis_name VARCHAR(255) NOT NULL,
    /* 助手画像 */
    portrait TEXT,
    task_id INT NOT NULL,
    model_id INT NOT NULL,
    temperature FLOAT NOT NULL,
    max_token INT NOT NULL,
    /* 可能引用多个知识库 */
    knowledge_ids VARCHAR(255),
    guide_word TEXT,
    FOREIGN KEY (assis_id) REFERENCES `assistant`(id),
    FOREIGN KEY (task_id) REFERENCES `task`(id),
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

/* 任务表 */
CREATE Table if NOT exists `task` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    /* 不同模型任务不完全相同 */
    model_id INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

/* 模型信息表 */
CREATE Table if NOT exists `model` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    /* 服务提供方 */
    server_from VARCHAR(255) NOT NULL,
    description TEXT,
    /* 模型上下文数量 */
    context VARCHAR(10),
    max_output VARCHAR(10),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

DROP TABLE IF EXISTS `api`;
/* 接口信息表 */
CREATE TABLE if NOT exists `api` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    description TEXT,
    /* 类型用途 */
    task_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    method VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    api_key VARCHAR(255),
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    FOREIGN KEY (task_id) REFERENCES `task`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

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