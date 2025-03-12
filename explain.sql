-- Active: 1733314319221@@localhost@3306@zgj
use `zgj`;
select t.name, m.name AS model_name, t.description from task t, model m where t.model_id = m.id;
select t.name, m.name as model_name, t.description from task t, model m where t.model_id = m.id and t.id = 2;