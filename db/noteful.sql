DROP TABLE IF EXISTS notes_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders CASCADE;

CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE notes(
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT CURRENT_TIMESTAMP,
  folder_id int REFERENCES folders ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1001 INCREMENT BY 1;

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE notes_tags (
  note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO folders (name)
VALUES
('Archive'),
('Drafts'),
('Personal'),
('Work');

INSERT INTO notes (title,content,folder_id)
VALUES 
('5 life lessons learned from cats','Lorem ipsum dolor sit amet, consectetur adipiscing elit,',100),
('What the government doesn''t want you to know about cats','Posuere sollicitudin aliquam',101),
('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet,', 102),
('7 things lady gaga has in common with cats','Tempor nec feugiat',102),
('The most incredible article about cats you''ll ever read','dolore magna aliqua',101),
('10 ways cats can help you live to 100','sollicitudin',103),
('9 reasons you can blame the recession on cats','voluptate velit',103),
('10 ways marketers are making you addicted to cats','Egestas egestas fringilla',102),
('11 ways investing in cats can make you a millionaire','ullamco laboris',101),
('Why you SHOULD forget everything you learned about cats','Tempor nec feugiat nisl pretium.',101);


INSERT INTO tags (name)
VALUES
('funny'),
('stupid'),
('smart');

INSERT INTO notes_tags (note_id, tag_id) 
VALUES
('1003','1'),
('1005','2'),
('1001','3'),
('1003','1'),
('1005','2'),
('1009','3'),
('1008','1'),
('1005','3'),
('1002','3');