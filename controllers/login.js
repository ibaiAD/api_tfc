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

  const user = await usersDAO.getUserByUserName(userName)

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

})

module.exports = loginRouter