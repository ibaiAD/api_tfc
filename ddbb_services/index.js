const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

// DAO USUARIOS
/* ****************************************************************************** */
const usersDAO = {
  // Devuelve todos los usuarios
  getAllUsers: async function getAllUsers() {
    const allUsers = await prisma.user.findMany()
    return allUsers
  },

  // Devuelve un usuario por su userName
  getUserByUserName: async function getUserByUserName(uName) {
    const u = await prisma.user.findUnique({
      where: {
        userName: uName
      }
    })
    return u
  },

  // Crea un nuevo usuario
  createUser: async function createUser(u) {
    let res
    let err

    const { userName, name, description, password } = u
    let passwordHash

    if (!userName) {
      err = { "required_field_missing": "userName" }
      return { res, err }
    }

    if (!name) {
      err = { "required_field_missing": "name" }
      return { res, err }
    }

    if (!password) {
      err = { "required_field_missing": "password" }
      return { res, err }
    }

    const saltRounds = 10
    passwordHash = await bcrypt.hash(u.password, saltRounds)
    console.log(passwordHash)

    console.log(userName, name, description, password)

    try {
      res = await prisma.user.create({
        data: {
          userName: userName,
          name: name,
          description: description,
          passwordHash: passwordHash
        }
      })
    } catch (error) {
      err = error
    }
    return { res, err }
  },

  // Elimina un usuario por su userName
  deleteUserByName: async function deleteUserByName(uName) {
    try {
      const u = await prisma.user.delete({
        where: {
          userName: uName
        }
      })
      return u
    } catch (error) {
      return null
    }
  }
}
/* ****************************************************************************** */

module.exports = {
  usersDAO
}