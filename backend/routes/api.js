const express = require("express");
const router = express.Router();
const Transaction = require('../models/transaction');
const Category = require('../models/category');

//get a list of transactions from the db
router.get('/transactions', (req, res, next) => {
  let query = {};
  let keys = Object.keys(req.query);
  let key = keys;

  if(req.query[key]){
    let values = req.query[key].split(',');
    query = {[key]: {$in: values } }
  }

  console.log(query);
  Transaction.find(query)
  .then(transactions => {
      console.log('transactions');
      console.log(transactions);
      res.send(transactions);
  })
});

//add a new transaction to the db
router.post('/transactions', (req, res, next) => {
    Transaction.create(req.body)
    .then(transaction => {
        res.send(transaction);
    })
    .catch(next);
});

//update a transactions to the db
router.put('/transactions/:id', (req, res, next) => {
    Transaction.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(transaction => {
        Transaction.findOne({_id: req.params.id})
        .then(transaction => {
            res.send(transaction);
        });
    })
});

//delete a transaction from the db
router.delete('/transactions/:id', (req, res, next) => {
    Transaction.findByIdAndRemove({_id: req.params.id})
    .then(transaction => {
        res.send(transaction)
    });
});

//get a list of transactions from the db
router.get('/categories', (req, res, next) => {
    Category.find({})
    .then(categories => {
        res.send(categories);
    });
});

module.exports = router;
