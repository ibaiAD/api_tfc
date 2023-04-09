const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { usersDAO } = require('../ddbb_services')
const { PRISMA_CODES } = require('../utils/prisma_codes')
const { PRISMA_CODES_400, PRISMA_CODES_404, PRISMA_CODES_409 } = PRISMA_CODES

loginRouter.post('/', async (request, response) => {
  const { body } = request
  const { userName, password } = body

  if (typeof password === 'undefined' || password === null) {
    const passwordRequiredError = { "required_field_missing": "password" }
    return response.status(400).send({ 'error': passwordRequiredError })
  }

  if (typeof password !== 'string' && typeof password === 'number') {
    const passwordTypeError = { "Provided Int, expected String": "password" }
    return response.status(400).send({ 'error': passwordTypeError })
  }

  if (typeof password !== 'string' && typeof password === 'boolean') {
    const passwordTypeError = { "Provided Boolean, expected String": "password" }
    return response.status(400).send({ 'error': passwordTypeError })
  }

  try {
    const { res: user, err } = await usersDAO.getUserByUserName(userName)
    console.log({ user })
    console.log({ err })

    if (typeof err !== 'undefined') {
      console.log(err)
      return response.status(400).send({ 'error': err })
    }

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid user or password'
      })
    }

    const userForToken = {
      id: user.id,
      userName: user.userName,
      role: user.role
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET,
      {
        expiresIn: 60 * 60
      }
    )

    return response.send({
      userName: user.userName,
      token
    })

  } catch (error) {
    console.error(error)
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }



})

module.exports = loginRouter