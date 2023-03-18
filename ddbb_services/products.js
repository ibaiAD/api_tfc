const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const productsDAO = {
  // Devuelve todos los productos
  getAllProducts: async function getAllProducts() {
    const allProducts = await prisma.product.findMany()
    return allProducts
  },

  // Devuelve un producto por su name
  getProductByName: async function getProductByName(name) {
    const p = await prisma.product.findUnique({
      where: {
        name: name
      }
    })
    return p
  },

  // Crea un nuevo producto
  createProduct: async function createProduct(p) {
    let res, err
    const { name, description, userId } = p
    console.log(userId)

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
}

module.exports = productsDAO