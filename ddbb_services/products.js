const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const validator = require('../utils/data_type_validation')

const productsDAO = {
  // Returns all products
  getAllProducts: async function getAllProducts() {
    const allProducts = await prisma.product.findMany()
    return allProducts
  },

  // Returns a product by its Id // TODO --> Implement data_type_validations
  getProductById: async function getProductById(id) {
    let res, err

    if (!id && id !== 0) {
      err = { "required_field_missing": "id" }
      return { res, err }
    }

    if (typeof id === 'string') {
      err = { "Provided String, expected Int": "id" }
      return { res, err }
    }

    if (id % 1 !== 0) {
      err = { "Provided Float, expected Int": "id" }
      return { res, err }
    }

    res = await prisma.product.findUnique({
      where: {
        id: id
      }
    })

    return { res, err }
  },

  // Returns products by name // TODO --> Implement data_type_validations (if needed)
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

  // Creates a new product // TODO --> Implement data_type_validations
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

    if (typeof name === 'number') {
      err = { "Provided Int, expected String": "name" }
      return { res, err }
    }

    if (typeof description === 'number') {
      err = { "Provided Int, expected String": "description" }
      return { res, err }
    }

    // Extracted from the token, this should never happen
    if (typeof userId === 'string') {
      err = { "Provided String, expected Int": "userId" }
      return { res, err }
    }

    res = await prisma.product.create({
      data: {
        name: name,
        description: description,
        userId: userId
      }
    })
    return { res, err }
  },

  // Deletes a product by its Id  // TODO --> Implement data_type_validations (if needed)
  deleteProductById: async function deleteProductById(pId) {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: pId,
      },
    })

    return deletedProduct
  },

  /// Updates a product by its Id // TODO --> Implement data_type_validations
  updateProductById: async function updateProductById(pId, name, description) {
    let res, err

    if (typeof name === 'number') {
      err = { "Provided Int, expected String": "name" }
      return { res, err }
    }

    if (typeof description === 'number') {
      err = { "Provided Int, expected String": "description" }
      return { res, err }
    }

    // avoid updating data when come from an empty form field as ''
    // TODO --> implement with validator.notEmpty
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