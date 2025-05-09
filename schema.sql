-- Active: 1734421393583@@101.200.220.142@3306@graduation

DROP DATABASE IF EXISTS `graduation`;
CREATE DATABASE IF NOT EXISTS `graduation` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `graduation`;

/* 测试开发环境 */
/* DROP DATABASE IF EXISTS `zgj`;
CREATE DATABASE IF NOT EXISTS `zgj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `zgj`; */

DROP TABLE IF EXISTS `user`;
CREATE Table if NOT exists `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,
    role_name VARCHAR(255),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `assistant`;
/* 助手信息配置表 */
CREATE Table if NOT exists `assistant` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    /* 调用大模型接口创建的应用 */
    application_id VARCHAR(255),
    /* 头像颜色 */
    avatar VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    /* 助手画像 */
    portrait TEXT,
    api_id INT,
    model_id INT,
    model_name VARCHAR(255),
    /* 模型采样温度 */
    temperature FLOAT,
    max_token INT,
    /* 可能引用多个知识库 */
    knowledge_ids VARCHAR(255),
    guide_word TEXT,
    /* 0下线 1上线 */
    on_off INT,
    flow_limit INT,
    /* 回答风格 */
    param_desc VARCHAR(255),
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (api_id) REFERENCES `api`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

/* DROP TABLE IF EXISTS `task`;
CREATE Table if NOT exists `task` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) */

DROP TABLE IF EXISTS `model`;
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
    task_name VARCHAR(255) NOT NULL,
    task_desc TEXT,
    url VARCHAR(255) NOT NULL,
    method VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    api_key VARCHAR(255),
    FOREIGN KEY (model_id) REFERENCES `model`(id),
    /* FOREIGN KEY (task_id) REFERENCES `task`(id), */
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

/* 历史会话与用户，助手多对多映射表 */
CREATE Table if NOT exists `chat_history` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assis_id INT NOT NULL,
    message TEXT,
    attachment TEXT,
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id),
    FOREIGN KEY (assis_id) REFERENCES `assistant`(id)
);

DROP TABLE IF EXISTS `knowledge`;
CREATE Table if NOT exists `knowledge` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    /* 0 文档知识库；1 QA知识库 */
    type INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    model_id INT NOT NULL,
    user_id INT NOT NULL,
    /* 调用模型接口生成的知识库id */
    knowledge_id VARCHAR(255) NOT NULL,
    FOREIGN KEY(model_id) REFERENCES `model`(id),
    FOREIGN KEY(user_id) REFERENCES `user`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_knowledge_user_model_type ON knowledge(user_id, model_id, type);

CREATE Table if NOT exists `doc_knowledge` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY(knowledge_id) REFERENCES `knowledge`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

CREATE Table if NOT exists `qa_knowledge` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    knowledge_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    /* 0 不启用；1 启用 */
    status INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(knowledge_id) REFERENCES `knowledge`(id),
    FOREIGN KEY(user_id) REFERENCES `user`(id),
    insert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);