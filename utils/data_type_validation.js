const validator = {

  required: function required(data) {
    let err

    const key = Object.keys(data)[0]
    const value = data[key]

    if (typeof value === 'undefined' || value === null || value === '') {
      err = { 'required_field_missing': { key, value } }
      return err
    }
  },

  notNull: function notNull(data) {
    let err
    const key = Object.keys(data)[0]
    const value = data[key]

    if (value === null) {
      err = { 'Argument must not be null': { key, value } }

      return err
    }
  },

  notEmpty: function notEmpty(data) {
    let err
    const key = Object.keys(data)[0]
    const value = data[key]

    if (value === '') {
      err = { 'Argument must not be an empty string': { key, value } }
      return err
    }
  },

  expectedInt: function expectedInt(data) {
    let err
    const key = Object.keys(data)[0]
    const value = data[key]

    console.log('isNaN(value)', isNaN(value))

    if (typeof value === 'boolean') {
      err = { 'Provided Boolean, expected Int': { key, value } }
      return err
    }

    if (typeof value === 'string') {
      err = { 'Provided String, expected Int': { key, value } }
      return err
    }

    if (value % 1 !== 0) {
      err = { 'Provided Float, expected Int': { key, value } }
      return err
    }
  },

  expectedIntAsString: function expectedIntAsString(data) {
    let err
    const key = Object.keys(data)[0]
    let value = data[key]

    console.log('isNaN(value)', isNaN(value))

    if (typeof value === 'boolean') {
      err = { 'Provided Boolean, expected Int': { key, value } }
      return err
    }

    if (isNaN(value)) {
      if (typeof value === 'string') {
        err = { 'Provided String, expected Int': { key, value } }
        return err
      }
    }

    value = Number(value)

    if (value % 1 !== 0) {
      err = { 'Provided Float, expected Int': { key, value } }
      return err
    }
  },

  expectedString: function expectedString(data) {
    let err
    const key = Object.keys(data)[0]
    const value = data[key]

    if (typeof value === 'boolean') {
      err = { 'Provided Boolean, expected String': { key, value } }
      return err
    }

    if (typeof value === 'number') {
      err = value % 1 === 0
        ? { 'Provided Int, expected String': { key, value } }
        : { 'Provided Float, expected String': { key, value } }
      return err
    }
  },

}

module.exports = validator