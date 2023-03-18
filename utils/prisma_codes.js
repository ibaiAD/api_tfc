const PRISMA_CODES = {
  PRISMA_CODES_400: ['P2000'],
  PRISMA_CODES_404: ['P2025'],
  PRISMA_CODES_409: ['P2002', 'P2003']
}

//P2003 --> Foreign key constraint failed on the field: `userId` (400, 409, 422)?

module.exports = {
  PRISMA_CODES
}



