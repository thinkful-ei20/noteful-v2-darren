

-- SELECT * FROM notes
-- ORDER BY id;


-- SELECT * FROM folders;

-- SELECT * FROM tags;

-- SELECT * FROM notes_tags;

-- SELECT notes.id as "NoteID",notes.name as "name", notes.folder_id as "noteFolderID", folder.name as "FolderName", tags.id as "TagID", tags.name as "tagName", folders.name as "FolderName" 
-- FROM notes
-- LEFT JOIN folders ON folders.id = notes.


-- SELECT notes.id, title, content, folders.id as "folder_id", folders.name as "folderName"
-- FROM notes
-- INNER JOIN folders
-- ON notes.folder_id = folders.id;

-- SELECT notes.id, title, content, folders.id as "folder_id", folders.name as "folderName", tags.id as "tagID", tags.name as "TagName"
-- FROM notes
-- LEFT JOIN folders ON notes.folder_id = folders.id
-- LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
-- LEFT JOIN tags ON notes_tags.tag_id = tags.id;

--  tags.id as "tagId",tags.name as "tagName"


-- SELECT restaurants.id, restaurants.name, grades.date as "date of C grade"
--     FROM restaurants
--     LEFT JOIN grades
--     ON grades.restaurant_id = restaurants.id
--     AND grades.grade = 'C'
--     ORDER BY grades.date DESC
--     LIMIT 5;

-- CREATE database "noteful-test"; // created for testing on friday
