const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const cors = require("cors")
const path = require('path')

app.use(express.static(path.join(__dirname, '../client/build')))
app.use(cors({ origin: '*' }))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

const Pool = require('pg').Pool

const pool = new Pool({
  user: 'memtrain',
  host: 'localhost',
  database: 'memtrain',
  password: 'memtrain',
  port: 5432,
})

app.listen(3000, () => {
  console.log('Postgres is running on port 5432')
  console.log('Express is running on port 3000')
})


app.post('/insert', async (req, res) => {
  const { tableName, data } = req.body

  try {
    const insertedData = await insertData(tableName, data)
    res.send(insertedData)
  } catch (error) {
    handleServerError(res, error)
  }

})

app.get('/get', async (req, res) => {
  const { table_name, param_name } = req.query
  const paramValue = req.query[param_name]

  if (!table_name || !param_name) {
    res.status(400).send('Missing required parameters')
    return
  }

  const queryText = `SELECT * FROM ${table_name} WHERE ${param_name} = $1`

  try {
    console.log(" ")
    console.log("queryText = {" + queryText + "} paramValue = " + paramValue)
    console.log(" ")
    console.log(" ")
    console.log("returning:")
    const { rows } = await pool.query(queryText, [paramValue])
    console.log(rows)
    console.log(" ")
    res.send(rows)
  } catch (error) {
    handleServerError(res, error)
  }

})

app.get('/get_today_or_earlier', async (req, res) => {
  const { table_name, param_name } = req.query
  const paramValue = req.query[param_name]

  const today = new Date()

  if (!table_name || !param_name) {
    res.status(400).send('Missing required parameters')
    return
  }

  const queryText = `SELECT * FROM ${table_name} WHERE ${param_name} = $1 AND next_review_date <= $2`

  try {
    const { rows } = await pool.query(queryText, [paramValue, today])
    console.log(' ')
    console.log(`queryText = ${queryText} paramValue = ${paramValue}`)
    console.log(' ')
    console.log('returning:')
    console.log(rows)
    console.log(' ')
    res.send(rows)
  } catch (error) {
    handleServerError(res, error)
  }
})

app.put('/update', async (req, res) => {
  const { tableName, data } = req.body

  if (!tableName || !data) {
    res.status(400).send('Missing required parameters')
    return
  }

  const updateFields = Object.keys(data)
    .filter(key => key !== 'id') // Exclude 'id' from update fields
    .map((key, index) => `${key} = $${index + 2}`)
    .join(', ')

  const queryText = `UPDATE ${tableName} SET ${updateFields} WHERE id = $1`

  try {
    const updateValues = Object.values(data).filter((_, index) => index !== 0) // Exclude 'id'
    console.log("updateValues=")
    console.log(updateValues)
    console.log("queryText=")
    console.log(queryText)
    console.log("data.id=")
    console.log(data.id)
    const { rowCount } = await pool.query(queryText, [data.id, ...updateValues])

    if (rowCount > 0) {
      res.send("success")
    } else {
      res.status(404).send(`Could not update table: ${tableName}`)
    }
  } catch (error) {
    handleServerError(res, error)
  }

})

app.delete('/delete', async (req, res) => {
  const { tableName, id } = req.body

  if (!tableName || !id) {
    res.status(400).send('Missing required parameters')
    return
  }

  const queryText = `DELETE FROM ${tableName} WHERE id = $1`

  try {
    const { rowCount } = await pool.query(queryText, [id])

    if (rowCount > 0) {
      res.send("success")
    } else {
      res.status(404).send(`No ${tableName} deleted!`)
    }
  } catch (error) {
    handleServerError(res, error)
  }
})


async function insertData(tableName, data) {
  const isArray = Array.isArray(data)
  const dataArray = isArray ? data : [data] // Convert single data to an array if needed

  try {
    const results = await Promise.all(
      dataArray.map(async (itemData) => {
        const keys = Object.keys(itemData).join(', ')
        const values = Object.values(itemData)
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')

        const queryText = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders}) RETURNING id`

        const queryWithValues = queryText.replace(/\$\d+/g, (match) => {
            const index = parseInt(match.substring(1)) - 1
            return values[index] === undefined ? match : `'${values[index]}'`
        })
        console.log("insertData : queryText=", queryWithValues);

        try {
          const { rowCount, rows } = await pool.query(queryText, values)

          if (rowCount > 0) {
            console.log("insertData: RETURNING:")
            console.log(rows[0])
            return rows[0]
          } else {
            throw new Error(`Failed to insert data into ${tableName}`)
          }
        } catch (error) {
          throw error
        }
      })
    )
    return isArray ? results : results[0] // Return array or single result as appropriate
  } catch (error) {
    throw error
  }
}

const handleServerError = (res, error) => {
  console.error("there was an error:")
  console.error(error)
  res.status(500).send("Internal Server Error")
}