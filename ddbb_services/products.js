const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const validator = require('../utils/data_type_validation')

const productsDAO = {
  // Returns all products
  getAllProducts: async function getAllProducts() {
    const allProducts = await prisma.product.findMany()
    return allProducts
  },

  // Returns a product by its Id
  getProductById: async function getProductById(id) {
    let res, err

    err = validator.required({ id }) || validator.expectedIntAsString({ id })
    if (err) { return { res, err } }

    res = await prisma.product.findUnique({
      where: {
        id: Number(id)
      }
    })

    return { res, err }
  },

  // Returns products by name
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

  // Creates a new product
  createProduct: async function createProduct(p, userId) {
    let res, err
    const { name, description } = p

    err = validator.required({ name }) || validator.expectedString({ name })
    if (err) { return { res, err } }

    err = validator.notNull({ description })
      || validator.expectedString({ description })
    if (err) { return { res, err } }

    // Extracted from the token, this should never happen
    err = validator.required({ userId }) || validator.expectedInt({ userId })
    if (err) { return { res, err } }

    res = await prisma.product.create({
      data: {
        name: name,
        description: description,
        userId: userId
      }
    })
    return { res, err }
  },

  // Deletes a product by its Id
  deleteProductById: async function deleteProductById(id) {
    let res, err

    err = validator.required({ id }) || validator.expectedInt({ id })
    if (err) { return { res, err } }

    res = await prisma.product.delete({
      where: {
        id: id,
      },
    })

    return { res, err }
  },

  /// Updates a product by its Id
  updateProductById: async function updateProductById(pId, name, description) {
    let res, err

    err = validator.notNull({ name })
      || validator.expectedString({ name })
    if (err) { return { res, err } }

    err = validator.notNull({ description })
      || validator.expectedString({ description })
    if (err) { return { res, err } }

    // avoid updating data when come from an empty form field as ''
    name ||= undefined
    description ||= undefined

    res = await prisma.product.update({
      where: {
        id: pId,
      },
      data: {
        name: name,
        description: description
      },
    })

    return { res, err }
  }
}

module.exports = productsDAO