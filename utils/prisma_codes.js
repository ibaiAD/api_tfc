const PRISMA_CODES = {
  PRISMA_CODES_400: ['P2000'],
  PRISMA_CODES_404: ['P2025'],
  PRISMA_CODES_409: ['P2002', 'P2003']
}

//P2003 --> Foreign key constraint failed on the field: `userId` (400, 409, 422)?

function handlePrismaErrors(err, response) {
  const { code, meta } = err
  // Gestion errores
  console.log(code)
  if (PRISMA_CODES.PRISMA_CODES_400.includes(code)) {
    return response.status(400).send({ 'error': meta })
  }
  if (PRISMA_CODES.PRISMA_CODES_404.includes(code)) {
    return response.status(404).send({ 'error': meta })
  }
  if (PRISMA_CODES.PRISMA_CODES_409.includes(code)) {
    return response.status(409).send({ 'error': meta })
  }
}

module.exports = {
  PRISMA_CODES,
  handlePrismaErrors
}



