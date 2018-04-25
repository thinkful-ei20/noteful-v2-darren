'use strict';

const express = require('express');

const router = express.Router();

const knex = require('../knex');

router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/folders/:id', (req,res,next) => {
  const id = req.params.id;

  knex
    .select('id','name')
    .from('folders')
    .where('id',id)
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/folders/:id', (req,res,next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableFields = ['name'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .update(updateObj)
    .where('folders.id', id)
    .returning(['id','name'])
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });

});















module.exports = router;
