const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const validator = require('../utils/data_type_validation')

const usersDAO = {
  // Returns all users
  getAllUsers: async function getAllUsers() {
    const allUsers = await prisma.user.findMany()
    return allUsers
  },

  // Returns a user by userName
  getUserByUserName: async function getUserByUserName(userName) {
    let res, err

    err = validator.required({ userName }) || validator.expectedString({ userName })
    if (err) { return { res, err } }

    res = await prisma.user.findUnique({
      where: {
        userName: userName
      }
    })
    return { res, err }
  },

  // Returns a user by id
  getUserById: async function getUserById(id) {
    let res, err

    err = validator.required({ id }) || validator.expectedIntAsString({ id })
    if (err) { return { res, err } }

    res = await prisma.user.findUnique({
      where: {
        id: Number(id)
      }
    })

    return { res, err }
  },

  // Creates a new user
  createUser: async function createUser(u) {
    let res
    let err

    const { userName, name, description, password } = u
    let passwordHash

    err = validator.required({ userName }) || validator.expectedString({ userName })
    if (err) { return { res, err } }

    err = validator.required({ name }) || validator.expectedString({ name })
    if (err) { return { res, err } }

    err = validator.required({ password }) || validator.expectedString({ password })
    if (err) { return { res, err } }

    err = validator.notNull({ description })
      || validator.expectedString({ description })
    if (err) { return { res, err } }

    try {
      // Encrypts Password --------------------------------->
      const saltRounds = 10
      passwordHash = await bcrypt.hash(password, saltRounds)
      // <---------------------------------------------------
      console.log(passwordHash)
      console.log(userName, name, description, password)

    } catch (error) {
      err = error
      return { res, err }
    }

    res = await prisma.user.create({
      data: {
        userName: userName,
        name: name,
        description: description,
        passwordHash: passwordHash,
        role: 'user'
      }
    })
    return { res, err }
  },

  // Deletes a user by userName
  deleteUserByName: async function deleteUserByName(uName) {
    const deletedUser = await prisma.user.delete({
      where: {
        userName: uName
      }
    })

    return deletedUser
  },

  // Updates a user
  updateUser: async function updateUser(userData) {
    let res, err, passwordHash
    const { id, userName, name, description, password, role } = userData
    console.log({ id }, { userName }, { name }, { description }, { password }, { role })

    err = validator.required({ id }) || validator.expectedIntAsString({ id })
    if (err) { return { res, err } }

    err = validator.notNull({ userName })
      || validator.notEmpty({ userName })
      || validator.expectedString({ userName })
    if (err) { return { res, err } }

    err = validator.notNull({ name })
      || validator.notEmpty({ name })
      || validator.expectedString({ name })
    if (err) { return { res, err } }

    err = validator.notNull({ description })
      || validator.expectedString({ description })
    if (err) { return { res, err } }

    err = validator.notNull({ password })
      || validator.notEmpty({ password })
      || validator.expectedString({ password })
    if (err) { return { res, err } }

    err = validator.notNull({ role })
      || validator.notEmpty({ role })
      || validator.expectedString({ role })
    if (err) { return { res, err } }

    if (password) {
      // Encrypts Password --------------------------------->
      const saltRounds = 10
      passwordHash = await bcrypt.hash(password, saltRounds)
      // <---------------------------------------------------
    }

    res = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        userName: userName,
        name: name,
        description: description,
        passwordHash: passwordHash,
        role: role
      },
    })

    return { res, err }

  }

}

module.exports = usersDAO