--YOU MUST DO THIS TO CONNECT
\c memtrain
You are now connected to database "memtrain" as user "davidtaylor".

Login:
psql -d memtrain -U memtrain

--DUMP:
pg_dump -h localhost -U memtrain -d memtrain -f "~/memtrain_db_backups/memtrain_backup_file.sql"
--RESTORE:
psql -h localhost -U memtrain -d memtrain < ~/memtrain_db_backups/memtrain_backup_file2.sql
--CRON JOB:
0 0 * * * /usr/bin/pg_dump -h localhost -U memtrain -d memtrain -F c -b -v -f ~/memtrain_db_backups/memtrain_backup_file.sql

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
\echo -                        training_sessions:\;
\echo\;
select * from training_sessions ORDER BY id;
\echo\;
\echo -                        card_results:\;
\echo\;
select * from card_results ORDER BY id;
\echo\;
\echo -                        training_records:\;
\echo\;
select * from training_records ORDER BY id;
\echo\;
