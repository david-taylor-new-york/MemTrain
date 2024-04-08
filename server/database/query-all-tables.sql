--YOU MUST DO THIS TO CONNECT
\c memtrain
You are now connected to database "memtrain" as user "davidtaylor".

Login:
psql -d memtrain -U dtaylor

--DUMP:
pg_dump -h localhost -U dtaylor -d memtrain -f "~/memtrain_db_backups/memtrain_backup_file.sql"
--RESTORE:
psql -h localhost -U dtaylor -d memtrain < ~/memtrain_db_backups/memtrain_backup_file2.sql
--CRON JOB:
0 0 * * * /usr/bin/pg_dump -h localhost -U dtaylor -d memtrain -F c -b -v -f ~/memtrain_db_backups/memtrain_backup_file.sql

-- Setting state directly within the function is a common practice in React applications because it's concise and often
-- easier to understand. It makes it clear that the state is being updated as part of the function's execution.
-- Returning the value and setting the context variables outside the function can make your code more modular and easier
-- to test because you can test the function's output independently.
-- Ultimately, the performance difference is negligible in most cases, and you should prioritize code readability and
-- maintainability. If the direct approach aligns well with the rest of your codebase and is more intuitive for you and your
-- team, it's a reasonable choice. However, if you prefer a more functional and modular approach, returning the value is
-- also a valid choice.

--Modularization: Break down your code into smaller functions or components. This can improve code readability and maintainability.
--Comments and Documentation: Add comments to your code, especially for complex logic, to explain what each part does. This makes it easier for other developers (or even yourself in the future) to understand the code.
--Consistency in Naming: Ensure consistent variable and function naming. This makes the code more readable and easier to understand.
--State Management: Consider using a state management library like Redux for handling global state, especially when dealing with complex state changes.
--Validation: Implement more robust input validation and error handling. Currently, you are using alerts for error messages. Consider displaying errors in a more user-friendly manner, like in a modal or toast.
--Performance Optimization: Evaluate the performance of your code, especially in loops, to ensure it doesn't become a bottleneck as the dataset grows.
--React Component Separation: If certain parts of your code can be encapsulated into separate React components, consider doing so. This can improve reusability.
--Testing: Implement unit tests for critical functions. This helps ensure that changes or additions to your code do not break existing functionality.
--Use Effect: Make use of the useEffect hook to handle side effects like fetching data or updating the UI based on changes in state.
--Error Handling: Implement error handling for async operations like API requests. Currently, your code assumes everything will work perfectly.
--Destructuring: Utilize object destructuring to simplify code when accessing properties from objects.
--Separation of Concerns: Ensure that each function/component has a clear and distinct purpose. For example, functions like calculateCardSchedules and calculateCardSchedule can be separated further.
--Code Duplication: Be on the lookout for code duplication and refactor where possible. For instance, you have similar code blocks in loadTrainingSessionPage and loadTrainingCardResultsPage.
--Magic Numbers: Replace magic numbers in your code with named constants or variables to improve readability.
--Consistent Return Values: Ensure that functions consistently return values or modify state, but not both, to avoid confusion.
--Consistent Event Handling: Be consistent in how you handle events. In some places, you prevent the default behavior of a form submission, while in others, you don't.
--Dependency Injection: Consider injecting dependencies (like API functions) rather than directly importing them. This makes it easier to mock these dependencies during testing.
--CSS Styles: Separate your CSS styles into external files or use CSS-in-JS libraries for better maintainability.

--1	1	What is your current, main goal?	react dev remote woods barn	\N
--2	1	What are the 3 things assuring ACTION?	Motivation, Ability, Trigger	\N
--3	1	Name the 3 pillars of humanness.	Autonomy, Ability, Connectedness	\N
--4	1	What are the 3 parts of an HTTP message?	req.query req.body req.params	\N
--5	1	Which HTTP methods use req.query?	get	4
--6	1	Which HTTP methods use req.body?	post, put, delete	4
--7	1	What is req.params used for?	extract params from route path	4
--8	1	Name the 5 axios response elements	data, status, statusText, headers, request	\N
--9	1	What is a class of Generic type?	class that can operate on objects of different types while maintaining type safety	\N
--10	1	What does REST stand for?	representational state transfer	\N
--11	1	Why are singletons bad?	create global state	\N
--12	1	Nodejs is:	asynchronous, event-driven, js runtime environment	\N
--13	1	ETL is:	extract, transform, load	\N
--14	1	4 http methods?	get put post delete	\N
--15	1	Name the 3 most popular web servers.	NodeJS, Apache, Nginx	\N
--16	1	What's one difference between SOAP and REST?	xml json	\N
--17	1	How do you create Objects?	static factory method	\N
--18	1	what are the 4 advantages?	meaningful name, can return singleton, can return subtype, can return subclass	17
--19	1	How do you enforce a singleton?	"public final field" "public static factory method" enum	\N
--20	1	Enum is best, why?	Serialization	19

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
\echo -                        card_schedules:\;
\echo\;
