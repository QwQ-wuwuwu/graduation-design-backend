use `zgj`;
select t.name, m.name AS model_name, t.description from task t, model m where t.model_id = m.id;
select t.name, m.name as model_name, t.description from task t, model m where t.model_id = m.id and t.id = 2;

select * from chat_history 
    where user_id = 1 and assis_id = 1 
    order by create_time desc 
    limit 15;