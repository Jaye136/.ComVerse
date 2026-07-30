CREATE TABLE if NOT EXISTS users (
	username VARCHAR(12) NOT NULL,
    password VARCHAR(12) NOT NULL,
    id CHAR(8) PRIMARY KEY,
    role VARCHAR(6) NOT NULL
);

CREATE TABLE if NOT EXISTS comments (
	contents VARCHAR(500) NOT NULL,
    author CHAR(8) NOT NULL,
    timestamp DATETIME NOT NULL,
    status VARCHAR(7) NOT NULL,
    id CHAR(8) PRIMARY KEY,
    parent CHAR(9) NOT NULL
);

CREATE TABLE if NOT EXISTS posts (
    title VARCHAR(200) NOT NULL,
	contents VARCHAR(1000) NOT NULL,
    author CHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    id CHAR(8) PRIMARY KEY,
    status VARCHAR(7) NOT NULL
);



DROP PROCEDURE IF EXISTS registerUser;
DROP PROCEDURE IF EXISTS fetchUser;
DROP PROCEDURE IF EXISTS promoteUser;
DROP PROCEDURE IF EXISTS demoteUser;

CREATE PROCEDURE registerUser
(
	IN user VARCHAR(12),
    IN pass VARCHAR(12),
    IN uuid CHAR(8),
    IN perms VARCHAR(6)
)
BEGIN
	INSERT INTO users (username, password, id, role)
	VALUES (user, pass, uuid, perms);
    SELECT * FROM users WHERE id = uuid;
END;

CREATE PROCEDURE fetchUser
(
	IN uuid CHAR(8)
)
BEGIN
	SELECT * FROM users WHERE id = uuid;
END;

CREATE PROCEDURE promoteUser
(
	IN uuid CHAR(8)
)
BEGIN
	UPDATE users SET role = 'mod' WHERE id = uuid;
END;

CREATE PROCEDURE demoteUser
(
	IN uuid CHAR(8)
)
BEGIN
	UPDATE users SET role = 'member' WHERE id = uuid;
END;



DROP PROCEDURE IF EXISTS addComment;
DROP PROCEDURE IF EXISTS deleteComment;
DROP PROCEDURE IF EXISTS fetchTopComment;
DROP PROCEDURE IF EXISTS fetchNestedComment;

CREATE PROCEDURE addComment
(
	IN cont VARCHAR(500),
    IN poster CHAR(8),
    IN time DATETIME,
    IN delstat VARCHAR(7),
    IN uuid CHAR(8),
    IN rep2what CHAR(9)
)
BEGIN
	INSERT INTO comments (contents, author, timestamp, status, id, parent)
	VALUES (cont, poster, time, delstat, uuid, rep2what);
    SELECT * FROM comments WHERE id = uuid;
END;

CREATE PROCEDURE deleteComment
(
	IN uuid CHAR(8)
)
BEGIN
	UPDATE comments SET status = 'deleted' WHERE id = uuid;
END;

CREATE PROCEDURE fetchTopComment
(
	IN postid CHAR(9)
)
BEGIN
	SELECT * FROM comments WHERE parent = postid ORDER BY timestamp DESC LIMIT 25;
END;

CREATE PROCEDURE fetchNestedComment
(
	IN commentid CHAR(9)
)
BEGIN
	SELECT * FROM comments WHERE parent = commentid ORDER BY timestamp DESC LIMIT 25;
END;



DROP PROCEDURE IF EXISTS addPost;
DROP PROCEDURE IF EXISTS deletePost;
DROP PROCEDURE IF EXISTS fetchPost;
DROP PROCEDURE IF EXISTS fetchPosts;

CREATE PROCEDURE addPost
(
    IN head VARCHAR(200),
	IN cont VARCHAR(1000),
    IN poster CHAR(8),
    IN time DATETIME,
    IN uuid CHAR(8),
    IN delstat VARCHAR(7)
)
BEGIN
	INSERT INTO posts (title, contents, author, timestamp, id, status)
	VALUES (head, cont, poster, time, uuid, delstat);
    SELECT * FROM posts WHERE id = uuid;
END;

CREATE PROCEDURE deletePost
(
	IN uuid CHAR(8)
)
BEGIN
	UPDATE posts SET status = 'deleted' WHERE id = uuid;
END;

CREATE PROCEDURE fetchPost
(
	IN uuid CHAR(8)
)
BEGIN
	SELECT * FROM posts WHERE id = uuid;
END;

CREATE PROCEDURE fetchPosts
(
	IN fetchReqAmount INT
)
BEGIN
	SELECT * FROM posts ORDER BY timestamp DESC LIMIT fetchReqAmount;
END;



