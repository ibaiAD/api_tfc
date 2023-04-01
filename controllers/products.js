const productsRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { productsDAO } = require('../ddbb_services')
const { handlePrismaErrors } = require('../utils/prisma_codes')
const USER_ROLES = require('../utils/user_roles')
const userExtractor = require('../middlewares/userExtractor')

// Get all products
productsRouter.get('/', async (request, response) => {
  try {
    allProducts = await productsDAO.getAllProducts()

    response.json(allProducts)

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})

// Create a new product
productsRouter.post('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  try {
    const { res, err } = await productsDAO.createProduct(product, user.id)

    if (typeof err !== 'undefined') {

      const prismaError = handlePrismaErrors(err, response)
      if (prismaError) {
        return prismaError
      }

      console.log(err)
      return response.status(400).send({ 'error': err })

    } else {
      return response.status(201).json(res)
    }

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})

// Delete a product by Id
productsRouter.delete('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

  if (getRes === null) {
    console.log('error: ', getErr)
    return response.status(400).send({ 'error': 'product not found' })
  }

  if (typeof getErr !== 'undefined') {

    const prismaError = handlePrismaErrors(getErr, response)
    if (prismaError) {
      return prismaError
    }

    return response.status(400).send({ 'error': getErr })
  }

  if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
    return response.status(401).send({ 'error': 'invalid user' })
  }

  // delete product
  const { res: deleteRes, err: deleteErr } = await productsDAO.deleteProductById(product.id)
  if (typeof deleteErr !== 'undefined') {

    const prismaError = handlePrismaErrors(deleteErr, response)
    if (prismaError) {
      return prismaError
    }

    return response.status(400).send({ 'error': deleteErr })
  }
  return response.status(204).end()


})

// Update a product by Id
productsRouter.put('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

  if (getRes === null) {
    console.log('error: ', getErr)
    return response.status(400).send({ 'error': 'product not found' })
  }

  if (typeof getErr !== 'undefined') {
    const prismaError = handlePrismaErrors(getErr, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(400).send({ 'error': getErr })
  }

  if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
    return response.status(401).send({ 'error': 'invalid user' })
  }

  // update product
  const { res: updateRes, err: updateErr } = await productsDAO.updateProductById(product.id, product.name, product.description)

  if (typeof updateErr !== 'undefined') {
    console.error(updateErr)
    const prismaError = handlePrismaErrors(updateErr, response)
    if (prismaError) {
      return prismaError
    }

    return response.status(600).send({ 'error': updateErr })
  }

  return response.json(updateRes)
})

module.exports = productsRouter
