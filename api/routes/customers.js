const express = require('express');
const mongoose = require('mongoose');
// const { saveEntry } = require('../../db/db');
const Customer = require('../model/customer');
// const errorTemplate = require('../../templates/errorTemplates');
const messages = require('../../messages/messages');
// const successTemplate = require('../../templates/successTemplate');
const router = express.Router();

//* GET ALL - show all users
router.get('/', (req, res, next) => {
  Customer.find()
  .select("-__v")
  .exec()
  .then(users => {
    console.log(users);
    res.status(200).json({
      // users,
      count: users.length,
      customer: users,
      message: 'Users - GET ALL',
      metadata: {
        method: req.method,
        host: req.hostname,
        // Timestamp: new Date().toLocaleTimeString()
      }
    })
  }).catch(err => {
    res.status(500).json({
      error: {
        message: err.message,
        status: err.status,
      }
    })
  });
});

router.get('/:customerId', (req, res, next) => {
  const customerId = req.params.customerId

  Customer.findOne({_id:customerId})
    .then(result => {
    res.status(200).json({
      message: 'Users - GET by Id',
      customer: result,
      metadata: {
        host: req.hostname,
        method: req.method,
        Timestamp: new Date().toLocaleTimeString()
      }
    })
    
  })
  .catch(err => {
    console.log(err.message);
    res.status(500).json({
      error: {
        message: err.message
      }
    })
  })
});

//* Create User
router.post('/', (req, res, next) => {
  // const productName = req.body.name;
  
  Customer.find({ 
    product: req.body.product,
    name: req.body.name
  })
    .select('name _id')
    .populate("product", "name")
    .exec()
    .then((result) => {
      if(result.length > 0) {
        return res.status(400).json({
            message: `${result[0].name}, already has an account.`,
        })
      }
      const newCustomer = new Customer({
        // _id: product._id,
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        orderCount: req.body.orderCount,
        email: req.body.email,
        age: req.body.age,
        living: req.body.living,
        product: req.body.product
      })

    newCustomer.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: messages.customer_on_save,
        customer: {
          id: result._id,
          name: result.name,
          orderCount: result.orderCount,
          email: result.email,
          age: result.age,
          living: result.living,
          product: result.product,
          metadata: {
            method: req.method,
            host: req.hostname
          }
        }
      })
    })
    .catch((err) => {
      res.status(500).json({
          error: {
            message:'Unable to save Author: ' + req.body.name
          }
      })
    });
  })
});


router.patch('/update/:customerId', (req, res, next) => {
 const customerId = req.params.customerId

 const updatedCustomer = {
  _id: customerId,
  name: req.body.name,
  orderCount: req.body.orderCount,
  email: req.body.email,
  age: req.body.age,
  living: req.body.living,
 }

 Customer.updateOne({
  _id:customerId
},{
  $set: updatedCustomer
}).then(result => {
  res.status(200).json({
    message: "Updated Customer",
    customer: {
      name: result.name,
      orderCount: result.orderCount,
      email: result.email,
      id: result._id,
      age: result.age,
      living: result.living,
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
});
})

router.delete('/delete/:customerId', (req, res, next) => {
  const customerId = req.params.customerId

Customer.deleteOne({_id:customerId})
  .then(result => {
    res.status(200).json({
      message: "Delete Customer",
      success: {result},
      metadata: {
        host: req.hostname,
        method: req.method,
        Timestamp: new Date().toLocaleTimeString(),
      }
    })
  }).catch(err => {
    res.status(500).json({
      message: err.message,
      status: err.status
    })
  });
})

module.exports = router