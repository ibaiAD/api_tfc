const productsRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { productsDAO } = require('../ddbb_services')
const { handlePrismaErrors } = require('../utils/prisma_codes')
const USER_ROLES = require('../utils/user_roles')
const userExtractor = require('../middlewares/userExtractor')

// Get products
productsRouter.get('/', async (request, response) => {

  const { name } = request.query
  let productsFound
  console.log(name, typeof name)

  try {
    if (typeof name !== 'undefined') {
      productsFound = await productsDAO.getProductsByName(name)
    } else {
      productsFound = await productsDAO.getAllProducts()
    }

    response.json(productsFound)

  } catch (error) {
    console.error(error)
    return response.status(500).send({ 'error': 'something went wrong' })
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
      console.log(err)
      return response.status(400).send({ 'error': err })

    } else {
      return response.status(201).json(res)
    }

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

// Delete a product by Id
productsRouter.delete('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  try {
    const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

    if (getRes === null) {
      console.log('error: ', getErr)
      return response.status(404).send({ 'error': 'product not found' })
    }

    if (typeof getErr !== 'undefined') {
      console.log(getErr)
      return response.status(400).send({ 'error': getErr })
    }

    if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
      return response.status(401).send({ 'error': 'invalid user' })
    }

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }

  // delete product
  try {
    const deletedProduct = await productsDAO.deleteProductById(product.id)
    return response.status(204).end()

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

// Update a product by Id
productsRouter.put('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  try {
    const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

    if (getRes === null) {
      console.log('error: ', getErr)
      return response.status(404).send({ 'error': 'product not found' })
    }

    if (typeof getErr !== 'undefined') {
      console.log(getErr)
      return response.status(400).send({ 'error': getErr })
    }

    if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
      return response.status(401).send({ 'error': 'invalid user' })
    }

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }

  // update product
  try {
    const { res: updateRes, err: updateErr } = await productsDAO.updateProductById(product.id, product.name, product.description)

    if (typeof updateErr !== 'undefined') {
      console.error(updateErr)
      return response.status(400).send({ 'error': updateErr })

    } else {
      return response.json(updateRes)
    }

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

// Get a product by Id
productsRouter.get('/:id', async (request, response) => {
  const id = Number(request.params.id)
  if (isNaN(id)) {
    return response.status(400).send({ "Provided String, expected Int": "id" })
  }

  try {
    const { res: getRes, err: getErr } = await productsDAO.getProductById(id)

    if (getRes === null) {
      console.log('error: ', getErr)
      return response.status(404).send({ 'error': 'product not found' })
    }

    if (typeof getErr !== 'undefined') {
      console.log(getErr)
      return response.status(400).send({ 'error': getErr })
    }

    return response.json(getRes)

  } catch (error) {
    console.error(error)
    const prismaError = handlePrismaErrors(error, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(500).send({ 'error': 'something went wrong' })
  } finally {
    await prisma.$disconnect()
  }
})

module.exports = productsRouter
