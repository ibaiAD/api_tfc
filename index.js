const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const { requestLogger, unknownEndpoint } = require('./middlewares')
const { usersDAO } = require('./ddbb_services')

const prisma = new PrismaClient()

const PRISMA_CODES_400 = ['P2000']
const PRISMA_CODES_409 = ['P2002']

app.use(express.json())

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Pruebas API</h1>')
})

// Endpoints api/users

/* ****************************************************************************** */
app.get('/api/users', async (request, response) => {

  try {
    allUsers = await usersDAO.getAllUsers()
    response.json(allUsers)

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

})

app.get('/api/users/:uName', async (request, response) => {
  const uName = request.params.uName
  try {
    const userFound = await usersDAO.getUserByUserName(uName)

    userFound
      ? response.json(userFound)
      : response.status(404).send({ error: 'unknown user' })

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

})

app.post('/api/users', async (request, response) => {
  const user = request.body

  const { res, err } = await usersDAO.createUser(user)
  // console.log(err)
  if (typeof res === 'undefined') {
    const { code, meta } = err
    // Gestion errores
    console.log(code)
    if (PRISMA_CODES_400.includes(code)) {
      return response.status(400).send({ 'error': meta })
    }
    if (PRISMA_CODES_409.includes(code)) {
      return response.status(409).send({ 'error': meta })
    }
    console.log(err)
    return response.status(600).send({ 'error': err })

  } else {
    return response.status(201).json(res)
  }
})

app.delete('/api/users/:uName', async (request, response) => {
  const uName = request.params.uName

  try {
    const userDeleted = await usersDAO.deleteUserByName(uName)

    userDeleted
      ? response.status(204).end()
      : response.status(404).send({ error: 'unknown user' })

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

})

/* ****************************************************************************** */

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
