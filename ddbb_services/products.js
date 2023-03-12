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
}

module.exports = productsDAO