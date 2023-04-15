const postProductForm = document.querySelector('#post-product-container form')

postProductForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const token = postProductForm.querySelector('#token').value
  const formData = new FormData(postProductForm)
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