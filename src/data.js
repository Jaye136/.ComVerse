import { fetchReqAmount, setFetchReq } from "./auth.js";
import { connectionPool } from "./database.js";

// -------- ID generation --------

// check if ID is valid (does not already exist)
const validID = async function (type, id) {
    if (type == 'c') {
        const [match] = await connectionPool.query('SELECT * FROM comments WHERE ID = ?', [id]);
        return match.length == 0;
    } else if (type == 'p') {
        const [match] = await connectionPool.query('SELECT * FROM posts WHERE ID = ?', [id]);
        return match.length == 0;
    } else { // if (type == u)
        const [match] = await connectionPool.query('SELECT * FROM users WHERE ID = ?', [id]);
        return match.length == 0;
    }
}

// generate a unique ID for a post
const generateID = function (type) {
    // Code credits (1 line): https://www.codemzy.com/blog/random-unique-id-javascript
    let id = Math.random().toString(36).substring(2, 10);
    return validID(type, id) ? id : generateID();
}


// -------- Comment-related functions --------

// add a top level comment (reply to post)
export async function addTopComment(contents, author, post) {
    const [topment] = await connectionPool.query('CALL addComment(?, ?, NOW(), ?, ?, ?)',
        [contents, author, 'active', generateID('c'), ['p' + post]]);
    return topment[0][0];
}

// add a nested comment (reply to comment)
export async function addNestComment(contents, author, comment) {
    const [nestment] = await connectionPool.query('CALL addComment(?, ?, NOW(), ?, ?, ?)',
        [contents, author, 'active', generateID('c'), ['c' + comment]]);
    return nestment[0][0];
}

// load top level comments on this post
async function loadTopComments(post) {
    const [topcoms] = await connectionPool.query('CALL fetchTopComment(?)', ['p' + post]);
    return topcoms[0];
}

// load nested comments for this comment
async function loadNestComments(comment) {
    const [nestcoms] = await connectionPool.query('CALL fetchNestedComment(?)', ['c' + comment]);
    return nestcoms[0];
}

// load comments & users in the format below
// [ {{comment, username}, {{comment, username}, {comment, username}}}, {{comment, poster}, {{}}} ]
export async function loadAllComments(post) {
    const topComments = await loadTopComments(post.id);
    const commentChunks = [];
    for (const comment of topComments) {
        const [topPosterRow] = await connectionPool.query('CALL fetchUser(?)', [comment.author]);
        const topPoster = topPosterRow[0][0];
        const topChunk = [comment, topPoster.username];

        const nestComments = await loadNestComments(comment.id);
        const nestChunks = [];
        for (const nestComment of nestComments) {
            const [nestPosterRow] = await connectionPool.query('CALL fetchUser(?)', [nestComment.author]);
            const nestPoster = nestPosterRow[0][0];
            nestChunks.push([nestComment, nestPoster.username]);
        }
        commentChunks.push([topChunk, nestChunks]);
    }

    return commentChunks;
}


// -------- User-related functions --------

// register new user
export async function registerUser(user, pass) {
    const [newser] = await connectionPool.query('CALL registerUser(?, ?, ?, ?)',
        [user, pass, generateID('u'), 'member']);
    return newser[0][0];
}


// -------- Post-related functions --------

// add new post
// should be in order (load from top
export async function addNewPost(title, contents, author) {
    const [post] = await connectionPool.query('CALL addPost(?, ?, ?, NOW(), ?, ?)',
        [title, contents, author, generateID('p'), 'active']);
    return post[0][0];
}

export async function loadPost(id) {
    const [match] = await connectionPool.query('CALL fetchPost(?)', [id]);
    if (match[0].length == 0) return [];
    const [poster] = await connectionPool.query('CALL fetchUser(?)', [match[0][0].author]);
    return [match[0][0], poster[0][0].username];
}

// load posts
// should start out 30, load 10 more posts every time user requests loading older posts
// if posts are less than fetchReqAmount, fetchReqAmount shrinks appropriately
export async function loadPosts() {
    // for checking how many posts there are in the db (no need to increment
    // fetchReqAmount if we've already loaded the entire forum into our feed)
    const [totalPosts] = await connectionPool.query('SELECT COUNT(*) AS total FROM posts');
    const totalNum = totalPosts[0].total;
    if (totalNum >= fetchReqAmount + 10) {
        setFetchReq(fetchReqAmount + 10);
    } else {
        setFetchReq(totalNum);
    }
    const [posts] = await connectionPool.query('CALL fetchPosts(?)', [fetchReqAmount]);
    return posts[0];
}

// refresh posts
// loads the same amount of posts, without adding more
export async function refreshPosts() {
    const [posts] = await connectionPool.query('CALL fetchPosts(?)', [fetchReqAmount]);
    return posts[0];
}