--YOU MUST DO THIS TO CONNECT
\c memtrain
You are now connected to database "memtrain" as user "davidtaylor".

Login:
psql -d memtrain -U memtrain

--DUMP:
pg_dump -h localhost -U memtrain -d memtrain --data-only --column-inserts --inserts -f ~/projects/memtrain_backups/memtrain_db_dump_{date}.sql
--RESTORE:
psql -h localhost -U memtrain -d memtrain < ~/projects/memtrain_backups/memtrain_db_dump_{date}.sql
--CRON JOB:
0 0 * * * /usr/local/bin/pg_dump -h localhost -U memtrain -d memtrain --data-only --column-inserts --inserts -f ~/projects/memtrain_backups/memtrain_db_dump_$(date +\%Y\%m\%d).sql

--DON'T FORGET TO SET TIMEZONE ON AWS INSTANCE:
sudo timedatectl set-timezone America/New_York

\echo\;
\echo -                        users:\;
\echo\;
select * from users ORDER BY id;
\echo\;
\echo -                        subjects:\;
\echo\;
select * from subjects ORDER BY id;
\echo\;
\echo -                        cards:\;
\echo\;
select * from cards ORDER BY id;
\echo\;
\echo -                        training_records:\;
\echo\;
select * from training_records ORDER BY id;
\echo\;
\echo -                        training_sessions:\;
\echo\;
select * from training_sessions ORDER BY id;
\echo\;
\echo -                        card_results:\;
\echo\;
select * from card_results ORDER BY id;
\echo\;
