const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { requestLogger, unknownEndpoint } = require('./middlewares')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

// Statics ---------------------------->
app.use('/', express.static('public'))
app.use('/documentation', express.static('public/documentation.html'))
// <------------------------------------

app.use(requestLogger)

// Endpoints api/users ---------------->
app.use('/api/users', usersRouter)
// <------------------------------------

// Endpoints api/login ---------------->
app.use('/api/login', loginRouter)
// <------------------------------------

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
