// TODO --> Create data type validations for all User and Product fields

// Users // TODO
const userValidator = {
  idValidator: function idValidator(id) {
    let err
    if (typeof id === 'boolean') {
      err = { "Provided Boolean, expected String": "userName" }
      return err
    }

    if (!id && id !== 0) {
      err = { "required_field_missing": "id" }
      return err
    }

    if (typeof id === 'string') {
      err = { "Provided String, expected Int": "id" }
      return err
    }

    if (id % 1 !== 0) {
      err = { "Provided Float, expected Int": "id" }
      return err
    }
  },

  // TODO
  userNameValidator: function userNameValidator(params) {

  },

  // TODO
  nameValidator: function nameValidator(params) {

  },

  // TODO
  descriptionValidator: function descriptionValidator(params) {

  },

  // TODO
  passwordValidator: function passwordValidator(params) {

  },

  // TODO
  roleValidator: function roleValidator(params) {

  },

}

// Products // TODO
const productValidator = {}


module.exports = {
  userValidator,
  productValidator
}