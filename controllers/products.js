const productsRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { productsDAO } = require('../ddbb_services')
const { PRISMA_CODES } = require('../utils/prisma_codes')
const { PRISMA_CODES_400, PRISMA_CODES_404, PRISMA_CODES_409 } = PRISMA_CODES
const USER_ROLES = require('../utils/user_roles')
const userExtractor = require('../middlewares/userExtractor')

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

productsRouter.post('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  try {
    const { res, err } = await productsDAO.createProduct(product, user.id)

    if (typeof res === 'undefined') {
      const { code, meta } = err
      // Gestion errores
      console.log(code)
      if (PRISMA_CODES_400.includes(code)) {
        return response.status(400).send({ 'error': meta })
      }
      if (PRISMA_CODES_404.includes(code)) {
        return response.status(404).send({ 'error': meta })
      }
      if (PRISMA_CODES_409.includes(code)) {
        return response.status(409).send({ 'error': meta })
      }
      console.log(err)
      return response.status(600).send({ 'error': err })

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

productsRouter.delete('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

  if (getRes === null) {
    console.log('error: ', getErr)
    return response.status(400).send({ 'error': 'product not found' })
  }

  if (typeof getRes === 'undefined') {
    const { code, meta } = getErr
    // Gestion errores
    console.log(code)
    if (PRISMA_CODES_400.includes(code)) {
      return response.status(400).send({ 'error': meta })
    }
    if (PRISMA_CODES_404.includes(code)) {
      return response.status(404).send({ 'error': meta })
    }
    if (PRISMA_CODES_409.includes(code)) {
      return response.status(409).send({ 'error': meta })
    }

    return response.status(400).send({ 'error': getErr })
  }

  if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
    return response.status(401).send({ 'error': 'invalid user' })
  }

  // delete product
  const { res: deleteRes, err: deleteErr } = await productsDAO.deleteProductById(product.id)
  if (typeof deleteRes === 'undefined') {
    const { code, meta } = deleteErr
    // Gestion errores
    console.log(code)
    if (PRISMA_CODES_400.includes(code)) {
      return response.status(400).send({ 'error': meta })
    }
    if (PRISMA_CODES_404.includes(code)) {
      return response.status(404).send({ 'error': meta })
    }
    if (PRISMA_CODES_409.includes(code)) {
      return response.status(409).send({ 'error': meta })
    }

    return response.status(400).send({ 'error': deleteErr })
  }
  return response.status(204).end()


})

productsRouter.put('/', userExtractor, async (request, response) => {
  const product = request.body
  const { user } = request

  const { res: getRes, err: getErr } = await productsDAO.getProductById(product.id)

  if (getRes === null) {
    console.log('error: ', getErr)
    return response.status(400).send({ 'error': 'product not found' })
  }

  if (typeof getRes === 'undefined') {
    // TODO extraer y renombrar *
    const prismaError = handlePrismaErrors(getErr, response)
    if (prismaError) {
      return prismaError
    }
    return response.status(400).send({ 'error': getErr })
  }

  if (!(user.role === USER_ROLES.admin || user.id === getRes.userId)) {
    return response.status(401).send({ 'error': 'invalid user' })
  }

  // update product TODO

  return response.json(getRes)
})

module.exports = productsRouter

// TODO extraer y renombrar
function handlePrismaErrors(err, response) {
  const { code, meta } = err
  // Gestion errores
  console.log(code)
  if (PRISMA_CODES_400.includes(code)) {
    return response.status(400).send({ 'error': meta })
  }
  if (PRISMA_CODES_404.includes(code)) {
    return response.status(404).send({ 'error': meta })
  }
  if (PRISMA_CODES_409.includes(code)) {
    return response.status(409).send({ 'error': meta })
  }
}