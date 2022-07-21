const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

const app = express()
const indexRoute = require('./routes/index.route')

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: process.env.LIMIT }))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
      limit: process.env.LIMIT,
      extended: true,
      parameterLimit: process.env.PARAMETER_LIMIT,
    }),
)  

// set EJS
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/download', express.static(path.join(__dirname, 'public')))

app.use('/', indexRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server listen to PORT=${process.env.PORT}`)
})