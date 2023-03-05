const { PrismaClient } = require('@prisma/client')
const { usersDAO } = require('../ddbb_services')
const usersRouter = require('express').Router()

const prisma = new PrismaClient()

const { PRISMA_CODES } = require('../utils/prisma_codes')
const { PRISMA_CODES_400, PRISMA_CODES_404, PRISMA_CODES_409 } = PRISMA_CODES

usersRouter.get('/', async (request, response) => {
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

usersRouter.get('/:uName', async (request, response) => {
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

usersRouter.post('/', async (request, response) => {
  const user = request.body

  const { res, err } = await usersDAO.createUser(user)

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
    return response.status(201).json(res)
  }
})

usersRouter.delete('/:uName', async (request, response) => {
  const uName = request.params.uName

  try {
    const { res, err } = await usersDAO.deleteUserByName(uName)

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
      return response.status(204).end()
    }

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }

})

// Delete when finish
async function toDo(response, field) {
  return response.status(623).send({ msg: 'TODO ' + field })
}

usersRouter.put('/', async (request, response) => {

  const FIELDS = new Map([
    ['userName', () => usersDAO.updateUserUserName(userName, newData)],
    ['name', () => toDo(response, field)],
    ['description', () => toDo(response, field)],
    ['password', () => toDo(response, field)],
    ['role', () => toDo(response, field)]
  ])

  const user = request.body
  const { userName, field, newData } = user

  if (!FIELDS.has(field)) {
    return response.status(400).send({ error: 'invalid field' })
  }

  if (field === 'role') {
    // TODO check authorization
    return response.status(401).send({ error: 'not allowed' })
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
