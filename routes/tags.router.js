'use strict';

const express = require('express');

const router = express.Router();

const knex = require('../knex');

/* ========== POST/CREATE ITEM ========== */
router.post('/tags', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.get('/tags', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/tags/:id', (req,res,next) => {
  const id = req.params.id;

  knex
    .select('id','name')
    .from('tags')
    .where('id',id)
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/tags/:id', (req,res,next) => {
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

  knex('tags')
    .update(updateObj)
    .where('tags.id', id)
    .returning(['id','name'])
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });

});

router.delete('/tags/:id', (req,res,next) => {
  const id = req.params.id;

  knex('tags')
    .where('tags.id', id)
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });  
});









module.exports = router;

