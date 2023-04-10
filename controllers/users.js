const usersRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { usersDAO } = require('../ddbb_services')
const { handlePrismaErrors } = require('../utils/prisma_codes')
const USER_ROLES = require('../utils/user_roles')
const userExtractor = require('../middlewares/userExtractor')

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
    const { res: userFound, err } = await usersDAO.getUserByUserName(uName)

    // deletes password from the user before returning it
    userFound && delete userFound.passwordHash

    return userFound
      ? response.json(userFound)
      : response.status(404).send({ 'error': 'user not found' })

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

usersRouter.delete('/', userExtractor, async (request, response) => {
  const { userName } = request.body
  const { user } = request

  try {
    const { res: userToDelete, err: getErr } = await usersDAO.getUserByUserName(userName)

    if (userToDelete === null) {
      console.log('error: ', getErr)
      return response.status(404).send({ 'error': 'user not found' })
    }

    if (typeof getErr !== 'undefined') {
      console.log(getErr)
      return response.status(400).send({ 'error': getErr })
    }

    if (!(user.role === USER_ROLES.admin || user.id === userToDelete.id)) {
      return response.status(401).send({ 'error': 'invalid user' })
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

  try {
    const deletedUser = await usersDAO.deleteUserByName(userName)
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

// usersRouter.put('/abc', async (request, response) => {

//   const FIELDS = new Map([
//     ['userName', () => usersDAO.updateUserUserName(userName, newData)],
//     ['name', () => usersDAO.updateUserName(userName, newData)],
//     ['description', () => usersDAO.updateUserDescription(userName, newData)],
//     ['password', () => usersDAO.updateUserPassword(userName, newData)],
//     ['role', () => usersDAO.updateUserRole(userName, newData)]
//   ])

//   const user = request.body
//   const { userName, field, newData } = user

//   if (!FIELDS.has(field)) {
//     return response.status(400).send({ error: 'invalid field' })
//   }

//   if (field === 'role') {
//     // TODO check authorization
//     if (user.token !== 'seguridad') {
//       return response.status(401).send({ error: 'not allowed' })
//     }
//   }

//   try {
//     const { res, err } = await FIELDS.get(field)()
//     console.log(res)

//     if (typeof res === 'undefined') {
//       const { code, meta } = err
//       // Gestion errores
//       console.log(code)
//       if (PRISMA_CODES_400.includes(code)) {
//         return response.status(400).send({ 'error': meta })
//       }
//       if (PRISMA_CODES_404.includes(code)) {
//         return response.status(404).send({ 'error': meta })
//       }
//       if (PRISMA_CODES_409.includes(code)) {
//         return response.status(409).send({ 'error': meta })
//       }
//       console.log(err)
//       return response.status(600).send({ 'error': err })

//     } else {
//       return response.json(res)
//     }

//   } catch (error) {
//     console.error(error)
//     process.exit(1)
//   } finally {
//     await prisma.$disconnect()
//   }

// })

usersRouter.put('/', userExtractor, async (request, response) => {
  const { user } = request
  const userData = request.body
  console.log({ user })
  console.log({ userData })

  try {

    if (user.role !== USER_ROLES.admin && userData.role) {
      return response.status(403).send({ 'error': 'forbiden role update' })
    }

    const { res: getRes, err: getErr } = await usersDAO.getUserById(userData.id)

    if (getRes === null) {
      console.log('error: ', getErr)
      return response.status(404).send({ 'error': 'user not found' })
    }

    if (typeof getErr !== 'undefined') {
      console.log(getErr)
      return response.status(400).send({ 'error': getErr })
    }

    if (!(user.role === USER_ROLES.admin || user.id === getRes.id)) {
      return response.status(401).send({ 'error': 'invalid user' })
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


  try {
    const { res: updateRes, err: updateErr } = await usersDAO.updateUser(userData)

    if (typeof updateErr !== 'undefined') {
      console.error(updateErr)
      return response.status(400).send({ 'error': updateErr })

    } else {
      // deletes password from the user before returning it
      delete updateRes.passwordHash
      return response.json(updateRes)
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

module.exports = usersRouter
