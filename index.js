const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { requestLogger, unknownEndpoint } = require('./middlewares')
// const { usersDAO } = require('./ddbb_services')
const usersRouter = require('./controllers/users')

const prisma = new PrismaClient()

app.use(express.json())

// Statics ---------------------------->
app.use('/', express.static('public'))
app.use('/documentation', express.static('public/documentation.html'))
// <------------------------------------

app.use(requestLogger)

// Endpoints api/users ---------------->
app.use('/api/users', usersRouter)
// <------------------------------------

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
