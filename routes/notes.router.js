'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

const hydrateNotes = require('../utils/hydrateNotes');



// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  const { searchTerm,folderId,tagId } = req.query;

  knex
    .select('notes.id', 'title', 'content','folders.id as folder_id', 'folders.name as folderName','notes_tags.note_id as noteIdFromTags' , 'tags.id as tagId','tags.name as tagName')
    .from('notes')
    .leftJoin('folders','notes.folder_id','folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags','notes_tags.tag_id','tags.id')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function(queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id',folderId);
      }
    })
    .modify(function (queryBuilder) {
      if (tagId) {
        queryBuilder.where('tag_id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
    .select('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName','notes_tags.note_id as noteTagNoteId' , 'tags.id as tagId','tags.name as tagName')
    .from('notes')
    .innerJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags','notes_tags.tag_id','tags.id')
    .where({ 'notes.id': noteId })
    .orderBy('notes.id')
    .then(result => {
      if (result) {
        const [hydrated] = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// // Put update an item
// router.put('/notes/:id', (req, res, next) => {
//   const id = req.params.id;
//   /***** Never trust users - validate input *****/
//   const updateObj = {};
//   const updateableFields = ['title', 'content', 'folder_id', 'tag_id'];

//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updateObj[field] = req.body[field];
//     }
//   });
//   /***** Never trust users - validate input *****/
//   if (!updateObj.title) {
//     const err = new Error('Missing `title` in request body');
//     err.status = 400;
//     return next(err);
//   }
//   //Update note in notes table
//   knex('notes').where('id',id).update(updateObj)
//     .then(() => {
//       knex('notes_tags')
//         .where('note_id', id)
//         .del()
//       //knex.del() from notes_tags table where(note_id = id)
//       // Insert tag_id from req.body into notes_tags table      
//       //return knex.insert(tag_id).into('notes_tags');
//         .then(() => {          
//           return knex.insert(updateObj.tag_id).into('notes');
//         })
//         .then(() => {
//           // Select the new note and leftJoin on folders and tags
//           return knex.select('notes.id', 'title', 'content',
//             'folders.id as folder_id', 'folders.name as folderName',
//             'tags.id as tagId', 'tags.name as tagName')
//             .from('notes')
//             .leftJoin('folders', 'notes.folder_id', 'folders.id')
//             .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
//             .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
//             .where('notes.id', id);
//         })
//         .then(result => {
//           if (result) {
//             // Hydrate the results
//             const hydrated = hydrateNotes(result)[0];
//             // Respond with a location header, a 201 status and a note object
//             res.location(`${req.originalUrl}/${hydrated.id}`).status(200).json(hydrated);
//           } else {
//             next();
//           }
//         })
//         .catch(err => next(err));
//     });
// });





/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folderId, tags = [] } = req.body;

  /***** Never trust users. Validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = {
    title: title,
    content: content,
    folder_id: (folderId) ? folderId : null
  };

  knex('notes').update(updateItem).where('id', noteId)
    .then(() => {
      return knex.del().from('notes_tags').where('note_id', noteId);
    })
    .then(() => {
      const tagsInsert = tags.map(tid => ({ note_id: noteId, tag_id: tid }));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => {
      return knex.select('notes.id', 'title', 'content',
        'folder_id as folderId', 'folders.name as folderName',
        'tags.id as tagId', 'tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then(result => {
      if (result) {
        const [hydrated] = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});






// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content, folderId, tags = [] } = req.body;

  const newItem = {
    title,
    content,
    folder_id : folderId
  };

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  let noteId;
  // Insert new note into notes table
  knex.insert(newItem).into('notes').returning('id')
    .then(([id]) => {
      // Insert related tags into notes_tags table
      noteId = id;
      const tagsInsert = tags.map(tagId => ({ note_id: noteId, tag_id: tagId }));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then(() => {
      // Select the new note and leftJoin on folders and tags
      return knex.select('notes.id', 'title', 'content',
        'folders.id as folder_id', 'folders.name as folderName',
        'tags.id as tagId', 'tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then(result => {
      if (result) {
        // Hydrate the results
        const hydrated = hydrateNotes(result)[0];
        // Respond with a location header, a 201 status and a note object
        res.location(`${req.originalUrl}/${hydrated.id}`).status(201).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  

});

// Delete an item
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where('notes.id', `${id}`)
    .del()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;
