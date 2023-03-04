const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { requestLogger, unknownEndpoint } = require('./middlewares')
// const { usersDAO } = require('./ddbb_services')
const usersRouter = require('./controllers/users')

const prisma = new PrismaClient()

app.use(express.json())

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Pruebas API</h1>')
})

// Endpoints api/users ---------------->
app.use('/api/users', usersRouter)
// <------------------------------------

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
