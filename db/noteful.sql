DROP TABLE IF EXISTS notes;

CREATE TABLE notes(
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT CURRENT_TIMESTAMP,
  folder_id int REFERENCES folders ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1001 INCREMENT BY 1;

INSERT INTO notes (title,content,folder_id)
VALUES 
('5 life lessons learned from cats','Lorem ipsum dolor sit amet, consectetur adipiscing elit,',100),
('What the government doesn''t want you to know about cats','Posuere sollicitudin aliquam',101),
('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet,', NULL),
('7 things lady gaga has in common with cats','Tempor nec feugiat',102),
('The most incredible article about cats you''ll ever read','dolore magna aliqua',NULL),
('10 ways cats can help you live to 100','sollicitudin',103),
('9 reasons you can blame the recession on cats','voluptate velit',NULL),
('10 ways marketers are making you addicted to cats','Egestas egestas fringilla',102),
('11 ways investing in cats can make you a millionaire','ullamco laboris',NULL),
('Why you SHOULD forget everything you learned about cats','Tempor nec feugiat nisl pretium.',101);

DROP TABLE IF EXISTS folders CASCADE;

CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

INSERT INTO folders (name)
VALUES
('Archive'),
('Drafts'),
('Personal'),
('Work');