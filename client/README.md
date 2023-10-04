# MEM-TRAIN

## Installation:


### DATABASE

Install PostGres database, then run the following script:

### `./database/setup-db.sql`


The server will reload when you make changes.

Maintenance scripts:

#### `./database/query-all-tables.sql`
#### `./database/insert-sample-data.sql`


---
### SERVER

In the server directory run:

### `nodemon ./index.js localhos3001`


The server will reload when you make changes.

---

### CLIENT
In the client directory run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
