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
app.use('/playground', express.static('public/playground.html'))
// <------------------------------------

app.use(requestLogger)

// Prueba upload images ------------------> BORRAR AL TERMINAR
const path = require("path") // move to top part
const multer = require('multer') //  move to top part
const fs = require("fs") // move to top part
const userExtractor = require('./middlewares/userExtractor') // move to top part

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('image'), (request, response) => {
  console.log('request.file', request.file) // delete
  console.log('request.body', request.body) // delete
  console.log('__dirname', __dirname) // delete
  console.log('request.file.path', request.file?.path) // delete  
  console.log('request.file.originalname', request.file?.originalname) // delete

  if (request.file) {
    console.log('request.file.destination', request.file.destination) // delete
    console.log('path.extname(request.file.originalname)', path.extname(request.file.originalname)) // delete
    const wantedName = 'imagen_prueba' + path.extname(request.file.originalname).toLowerCase()

    fs.rename(request.file.path, request.file.destination + wantedName, renameError => {
      console.error(renameError)
      console.log('renombra')
    })
  }

  // fs.rm('uploads/' + 'imagen_prueba.jpg', () => console.log('elimina')) // delete
  // fs.unlink('uploads/' + 'imagen_prueba.jpg', () => console.log('elimina')) // delete

  return response.json({ 'file': request.file, 'body': request.body })
})
// <---------------------------------------

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
