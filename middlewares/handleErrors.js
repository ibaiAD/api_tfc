const ERROR_HANDLERS = {
  CastError: res => res.status(400).end,
  JsonWebTokenError: res => {
    return res.status(401).json({ error: 'token missing or invalid' })
  },
  TokenExpiredError: res => {
    return res.status(401).json({ error: 'token expired' })
  },
  defaultError: res => res.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.log('handleErrors')
  console.error(error.name)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  return handler(response, error)
}