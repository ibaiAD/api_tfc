const productsRouter = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { productsDAO } = require('../ddbb_services')

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

productsRouter.post('/', async (request, response) => {
  console.log('Llega a: producsRouter post')

  // TODO: extraer el userId del token y añadirlo a la request
  const product = request.body

  try {
    await productsDAO.createProduct(product)
    response.json(product)
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }



})

module.exports = productsRouter