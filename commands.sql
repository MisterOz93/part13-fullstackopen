/*using elephantSQL browser tool, copy/pasting commands here for exercise 13.2 */
create table blogs (id SERIAL PRIMARY KEY, author TEXT, url TEXT NOT NULL, title TEXT NOT NULL, likes INTEGER default 0);
insert into blogs (author, url, title, likes) values ('Foo McFoo', 'www.blogging101.com', 'how to blog', 42);
insert into blogs (author, url, title, likes) values ('Bar Barrington', 'www.www.com', 'is this thing on?', 1);
insert into blogs (author, url, title) values ('Foo McFoo', 'www.blogspert.com', 'the most important blog every written');
