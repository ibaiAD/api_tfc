const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { requestLogger, unknownEndpoint } = require('./middlewares')
const handleErrors = require('./middlewares/handleErrors')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const productsRouter = require('./controllers/products')

app.use(express.json())

// Statics ---------------------------->
app.use('/', express.static('public'))
app.use('/documentation', express.static('public/documentation.html'))
// <------------------------------------

app.use(requestLogger)

// Endpoints api/users ------------------->
app.use('/api/users', usersRouter)
// <---------------------------------------

// Endpoints api/login ------------------->
app.use('/api/login', loginRouter)
// <---------------------------------------

// Endpoints api/products ---------------->
app.use('/api/products', productsRouter)
// <---------------------------------------

app.use(unknownEndpoint)
app.use(handleErrors)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
