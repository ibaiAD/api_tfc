const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

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

    const { userName, name, description, password, role } = u
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

    if (!role) {
      err = { "required_field_missing": "role" }
      return { res, err }
    }

    try {
      // Encrypts Password --------------------------------->
      const saltRounds = 10
      passwordHash = await bcrypt.hash(password, saltRounds)
      // <---------------------------------------------------
      console.log(passwordHash)
      console.log(userName, name, description, password, role)

      res = await prisma.user.create({
        data: {
          userName: userName,
          name: name,
          description: description,
          passwordHash: passwordHash,
          role: role
        }
      })
    } catch (error) {
      err = error
    }
    return { res, err }
  },

  // Elimina un usuario por su userName
  deleteUserByName: async function deleteUserByName(uName) {
    let res
    let err
    try {
      res = await prisma.user.delete({
        where: {
          userName: uName
        }
      })

    } catch (error) {
      err = error
    }
    return { res, err }
  },

  // Actualiza el userName de un usuario
  updateUserUserName: async function updateUserUserName(uName, newData) {
    console.log('updateUserUserName')
    let res, err
    try {
      res = await prisma.user.update({
        where: {
          userName: uName
        },
        data: {
          userName: newData,
        },
      })
    } catch (error) {
      console.log(error)
      err = error
    }
    return { res, err }
  },

  // Actualiza el userName de un usuario
  updateUserName: async function updateUserName(uName, newData) {
    console.log('updateUserName')
    let res, err
    try {
      res = await prisma.user.update({
        where: {
          userName: uName
        },
        data: {
          name: newData,
        },
      })
    } catch (error) {
      console.log(error)
      err = error
    }
    return { res, err }
  },

  // Actualiza el userName de un usuario
  updateUserDescription: async function updateUserDescription(uName, newData) {
    console.log('updateUserDescription')
    let res, err
    try {
      res = await prisma.user.update({
        where: {
          userName: uName
        },
        data: {
          description: newData,
        },
      })
    } catch (error) {
      console.log(error)
      err = error
    }
    return { res, err }
  },

  // TODO ------------------------------------>

  // Actualiza la contrase??a de un usuario
  updateUserPassword: async function updateUserPassword(uName, newData) {
    console.log('updateUserPassword')
    let res, err, passwordHash
    try {
      // Encrypts Password --------------------------------->
      const saltRounds = 10
      passwordHash = await bcrypt.hash(newData, saltRounds)
      // <---------------------------------------------------

      res = await prisma.user.update({
        where: {
          userName: uName
        },
        data: {
          passwordHash: passwordHash,
        },
      })
    } catch (error) {
      console.log(error)
      err = error
    }
    return { res, err }
  },

  // <-----------------------------------------

  // Actualiza el rol de un usuario
  updateUserRole: async function updateUserRole(uName, newData) {
    console.log('updateUserRole')
    let res, err
    try {
      res = await prisma.user.update({
        where: {
          userName: uName
        },
        data: {
          role: newData,
        },
      })
    } catch (error) {
      console.log(error)
      err = error
    }
    return { res, err }
  }

}
/* ****************************************************************************** */

module.exports = {
  usersDAO
}