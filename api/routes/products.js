const express = require('express');
const mongoose = require('mongoose');
const { saveEntry } = require('../../db/db');
const Product = require('../model/product');
const successTemplate = require('../../templates/successTemplate');
const messages = require('../../messages/messages');
const errorTemplate = require('../../templates/errorTemplates');
const router = express.Router();


//* GET ALL - show all products
router.get('/', (req, res, next) => {

  Product.find({})
  .then(result => {
    console.log(result)
    res.status(200).json({
      result,
      message: 'Product - GET ALL',
      method: req.method,
      Timestamps: Date.now
    })
  })
  .catch(err => {
    console.log(err.message);
    res.status(500).json({
      error: {
        message: err.message,
        status: err.status
      }
    })
  })
});

//* GET Product by Id
router.get('/:productId', (req, res, next) => {
  const productId = req.params.productId

  Product.findById({_id:productId})
  .then(result =>  {
    console.log(result)
    res.status(200).json({                
      message: `Products - GET by ID at:' ,${Date.now}`,
      product: result,
    })
  })
  .catch(err => {
    console.log(err.message)
    res.status(500).json({
      error: {
        message: err.message
      }
    })
    // return errorTemplate(res, err, messages.product_on_unsaved, 500)
  })                                      
});
//* Create Product - removed add
router.post('/', (req, res, next) => {
  Product.find({
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    sold: req.body.sold,
    manufacture: req.body.manufacture
  })
  .then(result => {
    console.log(result)
    if (result.length > 0) {
      res.status(406).json({
        message: `${result[0].name} already exist`,
      })
    } else {
      
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        sold: req.body.sold,
        manufacture: req.body.manufacture
      });

      saveEntry(newProduct)
        .then((dbProduct) => {
          console.log(dbProduct)
          return res.status(201).json({
            message: messages.product_saved,
            product: dbProduct
          })
        })
        .catch(err => {
          res.status(500).json({
            error: {
              message: err.message,
              status: err.status
            }
          })
        })
    }
  })
  .catch(err => {
    console.log(err.message)
    res.status(500).json({
      error: {
        message: err.message
      }
    })
  })
  

});

router.patch('/:productId', (req, res, next) => {
  const productId = req.params.productId

  const updatedProduct = {
    _id: productId,
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    manufacture: req.body.manufacture
  }

  Product.updateOne({
    _id:productId
  },{
    $set: updatedProduct
  })
  .then(result => {
    res.status(200).json({
      message: messages.product_updated,
      product: {
        name: result.name,
        price: result.price,
        type: result.type,
        manufacture: result.manufacture
      },
      metadata: {
        host: req.hostname,
        method: req.method,
        Timestamp: new Date().toLocaleTimeString(),
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: {
        message: err.message,
        status: err.status
      }
    })
  })
})

router.delete('/:productId', (req, res, next) => {
  const productId = req.params.productId

  Product.deleteOne({
    _id: productId
  })
  .exec()
  .then(result => {
    res.status(200).json({
      // id:id,
      message: 'Users - DELETE by Id',
      request:{
        method: 'GET',
        url: 'http://localhost:80/products/' + productId
      }
      // Timestamp: new Date().toLocaleTimeString()
    })
    
  })
  .catch(err => {
    console.log(err.message);
  })
})

module.exports = router