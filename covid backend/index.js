const express = require('express')
const cors = require('cors')
const converter = require('./Route/route')
const app = express()
app.use(cors());

app.use(express.json())
app.use(converter)

const port = 3000

app.listen(port, () => console.log('run'))