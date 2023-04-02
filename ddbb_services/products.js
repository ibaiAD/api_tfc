const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const productsDAO = {
  // Devuelve todos los productos
  getAllProducts: async function getAllProducts() {
    const allProducts = await prisma.product.findMany()
    return allProducts
  },

  // Devuelve un producto por su id
  getProductById: async function getProductById(id) {
    let res, err

    if (!id && id !== 0) {
      err = { "required_field_missing": "id" }
      return { res, err }
    }

    if (typeof id !== 'number' && typeof id === 'string') {
      err = { "Provided String, expected Int": "id" }
      return { res, err }
    }

    if (id % 1 !== 0) {
      err = { "Provided Float, expected Int": "id" }
      return { res, err }
    }

    try {
      res = await prisma.product.findUnique({
        where: {
          id: id
        }
      })
    } catch (error) {
      err = error
    }

    return { res, err }
  },

  // Devuelve productos por nombre
  getProductsByName: async function getProductsByName(productName) {
    const result = await prisma.product.findMany({
      where: {
        name: {
          contains: productName,
        },
      },
    })

    return result
  },

  // Crea un nuevo producto
  createProduct: async function createProduct(p, userId) {
    let res, err
    const { name, description } = p

    if (!name) {
      err = { "required_field_missing": "name" }
      return { res, err }
    }

    if (!userId) {
      err = { "required_field_missing": "userId" }
      return { res, err }
    }

    if (typeof name === 'number' && typeof name !== 'string') {
      err = { "Provided Int, expected String": "name" }
      return { res, err }
    }

    if (typeof description === 'number' && typeof description !== 'string') {
      err = { "Provided Int, expected String": "description" }
      return { res, err }
    }

    // Lo extrae del token, no debería darse el caso
    if (typeof userId !== 'number' && typeof userId === 'string') {
      err = { "Provided String, expected Int": "userId" }
      return { res, err }
    }

    try {
      res = await prisma.product.create({
        data: {
          name: name,
          description: description,
          userId: userId
        }
      })
    } catch (error) {
      err = error
    }

    return { res, err }

  },

  // Elimina un producto por Id
  deleteProductById: async function deleteProductById(pId) {
    let res, err

    try {
      res = await prisma.product.delete({
        where: {
          id: pId,
        },
      })
    } catch (error) {
      err = error
    }
    return { res, err }
  },

  // Actualiza un producto por Id
  updateProductById: async function updateProductById(pId, name, description) {
    let res, err

    if (typeof name === 'number' && typeof name !== 'string') {
      err = { "Provided Int, expected String": "name" }
      return { res, err }
    }

    if (typeof description === 'number' && typeof description !== 'string') {
      err = { "Provided Int, expected String": "description" }
      return { res, err }
    }

    try {
      res = await prisma.product.update({
        where: {
          id: pId,
        },
        data: {
          name: name,
          description: description
        },
      })

    } catch (error) {
      err = error
    }

    return { res, err }


  }
}

module.exports = productsDAO