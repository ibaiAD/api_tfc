const usersRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { usersDAO } = require('../ddbb_services')
const { PRISMA_CODES } = require('../utils/prisma_codes') // borrar al refactorizar
const { PRISMA_CODES_400, PRISMA_CODES_404, PRISMA_CODES_409 } = PRISMA_CODES // borrar al refactorizar
const { handlePrismaErrors } = require('../utils/prisma_codes')

usersRouter.get('/', async (request, response) => {
  try {
    allUsers = await usersDAO.getAllUsers()

    // deletes password from the users before returning them
    allUsers.forEach(user => {
      delete user.passwordHash
    });

    response.json(allUsers)

  } catch (error) {
    console.error(error)
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }

})

usersRouter.get('/:uName', async (request, response) => {
  const uName = request.params.uName
  try {
    const userFound = await usersDAO.getUserByUserName(uName)

    // deletes password from the user before returning it
    userFound && delete userFound.passwordHash

    userFound
      ? response.json(userFound)
      : response.status(404).send({ error: 'unknown user' })

  } catch (error) {
    console.error(error)
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }

})

usersRouter.post('/', async (request, response) => {
  const user = request.body

  try {
    const { res, err } = await usersDAO.createUser(user)

    if (typeof err !== 'undefined') {
      console.log(err)
      return response.status(400).send({ 'error': err })

    } else {
      // deletes password from the user before returning it
      delete res.passwordHash
      return response.status(201).json(res)
    }

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

// TODO --> Añadir TOKEN
usersRouter.delete('/:uName', async (request, response) => {
  const uName = request.params.uName

  try {
    const deletedUser = await usersDAO.deleteUserByName(uName)
    return response.status(204).end()

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

// TODO --> Cambiar gestión de errores, refactorizar métodos asociados DAO, Añadir TOKEN, etc
usersRouter.put('/', async (request, response) => {

  const FIELDS = new Map([
    ['userName', () => usersDAO.updateUserUserName(userName, newData)],
    ['name', () => usersDAO.updateUserName(userName, newData)],
    ['description', () => usersDAO.updateUserDescription(userName, newData)],
    ['password', () => usersDAO.updateUserPassword(userName, newData)],
    ['role', () => usersDAO.updateUserRole(userName, newData)]
  ])

  const user = request.body
  const { userName, field, newData } = user

  if (!FIELDS.has(field)) {
    return response.status(400).send({ error: 'invalid field' })
  }

  if (field === 'role') {
    // TODO check authorization
    if (user.token !== 'seguridad') {
      return response.status(401).send({ error: 'not allowed' })
    }
  }

  try {
    const { res, err } = await FIELDS.get(field)()
    console.log(res)

    if (typeof res === 'undefined') {
      const { code, meta } = err
      // Gestion errores
      console.log(code)
      if (PRISMA_CODES_400.includes(code)) {
        return response.status(400).send({ 'error': meta })
      }
      if (PRISMA_CODES_404.includes(code)) {
        return response.status(404).send({ 'error': meta })
      }
      if (PRISMA_CODES_409.includes(code)) {
        return response.status(409).send({ 'error': meta })
      }
      console.log(err)
      return response.status(600).send({ 'error': err })

    } else {
      return response.json(res)
    }

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

})

module.exports = usersRouter
