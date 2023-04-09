const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name:{
    type: String,
    required: true,
  },
  orderCount:[{
    type: Number,
    max: 100
  }],
  email: {
    type: String,
    lowercase: true,
    default: 'example@example.com'
  },
  age:{
    type: Number,
    min: 1,
    max: 120
  },
  living: {
    type: Boolean,
    // required: true
  }
  });

  // customerSchema.pre('find', () => {
  //   console.log(this instanceof mongoose.Query);
  //   return this.start = Date.now()
  // });

  // customerSchema.post('find', (result) => {
  //   console.log('find() returned ' + JSON.stringify(result))
  //   console.log('find() took ' + (Date.now() - this.start) + 'milliseconds')
  // })

  module.exports = mongoose.model('Customer', customerSchema)