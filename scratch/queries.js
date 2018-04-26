'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .where('notes.id', `${id}`)  
//   .orderBy('notes.id')
//   .then(results => {
//     res.json(results);
//   })
//   .catch(err => {
//     next(err);
//   });

// knex('notes')  
//   .modify(queryBuilder => {
//     if(!updateObj.content) {
//       queryBuilder.update({'title': `${updateObj.title}`});
//     } else {
//       queryBuilder.update({'title': `${updateObj.title}`, 'content':`${updateObj.content}`});
//     }
//   })
//   .where('notes.id', `${id}`)  
//   .then(results => {
//     const newLocal = res.json(results);
//   })
//   .catch(err => {
//     next(err);
//   });

// knex
//   .insert({
//     'title': `${title}`,
//     'content': `${content}`
//   })
//   .into('notes')
//   .returning('notes.id','title','content')
//   .then(results => {
//     res.json(results);
//   })
//   .catch(err => {
//     next(err);
//   });

// knex('notes')
//   .where('notes.id', `${id}`)
//   .del()
//   .then(results => {
//     res.status(204).json(results);
//   })
//   .catch(err => {
//     next(err);
//   });

// const noteId = 99;
// const result = [34, 56, 78].map(tagId => ({ note_id: noteId, tag_id: tagId }));
// console.log(`insert: ${result} into notes_tags`);