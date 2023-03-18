const productsRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { productsDAO } = require('../ddbb_services')
const { PRISMA_CODES } = require('../utils/prisma_codes')
const { PRISMA_CODES_400, PRISMA_CODES_404, PRISMA_CODES_409 } = PRISMA_CODES
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

  try {
    const { res, err } = await productsDAO.createProduct(product)

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

module.exports = productsRouter