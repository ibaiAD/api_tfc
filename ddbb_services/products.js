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

    if (!id) {
      err = { "required_field_missing": "id" }
      return { res, err }
    }

    if (typeof id !== 'number' && typeof id === 'string') {
      err = { "Provided String, expected Int": "id" }
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
    // TODO
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
}

module.exports = productsDAO