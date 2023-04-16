const uploadProductForm = document.querySelector('#post-product-container form#upload')
const postProductForm = document.querySelector('#post-product-container form#post-product')
const updateProductForm = document.querySelector('#post-product-container form#update-product')

uploadProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const token = uploadProductForm.querySelector('#token').value
  const formData = new FormData(uploadProductForm)
  console.log({ formData })
  console.log('enviando...')
  console.log({ token })
  fetch('/upload', {
    method: 'post',
    headers: new Headers({
      'Authorization': 'Bearer ' + token
    }),
    body: formData
  })
})

postProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const token = postProductForm.querySelector('#token').value
  const formData = new FormData(postProductForm)
  console.log({ formData })
  console.log('enviando...')
  console.log({ token })
  fetch('/api/products', {
    method: 'post',
    headers: new Headers({
      'Authorization': 'Bearer ' + token
    }),
    body: formData
  })
})

updateProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const token = updateProductForm.querySelector('#token').value
  const formData = new FormData(updateProductForm)
  console.log({ formData })
  console.log('enviando...')
  console.log({ token })
  fetch('/api/products', {
    method: 'put',
    headers: new Headers({
      'Authorization': 'Bearer ' + token
    }),
    body: formData
  })
})