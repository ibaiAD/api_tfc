const IMG_EXTENSIONS = ['.jpg', '.jpeg']

function validateExtension(ext) {
  return IMG_EXTENSIONS.includes(ext)
}

module.exports = validateExtension