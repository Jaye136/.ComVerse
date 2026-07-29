import express from "express";
import { addNewPost, addTopComment, addNestComment, deleteComment, loadAllComments, loadPost, refreshPosts } from "./data.js";
import { loadSchema } from "./database.js";
import { currUser } from "./auth.js";
import { testStuff } from "./testfns.js";
const app = express();
const port = 3000; // high number = lower access

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

await loadSchema();
await testStuff();

app.get('/posts', async (req, res) => {
    const postList = await refreshPosts();
    res.render("fpage.ejs", { postList, currUser, authCheck:(currUser && currUser.role == 'mod') }
    );
});

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const loadResult = await loadPost(id);

    if (loadResult.length == 0) {
        return res.status(404).render("post404.ejs", { currUser, authCheck:(currUser && currUser.role == 'mod') });
    }
    
    const post = loadResult[0];
    const poster = loadResult[1];
    const commentChunks = await loadAllComments(post);
    console.log(commentChunks);
    res.render("post.ejs", { post, poster, commentChunks, currUser, authCheck:(currUser && currUser.role == 'mod') });
});

app.post("/posts/:id/comment", async (req, res) => {
    const comData = req.body;
    if (comData.parType == 'p') {
        await addTopComment(comData.comment, currUser.id, comData.parent);
    } else {
        await addNestComment(comData.comment, currUser.id, comData.parent);
    }
    res.redirect(`/posts/${req.params.id}`);
});

app.post("/posts/:id/delcom", async (req, res) => {
    const comData = req.body;
    console.log("delete request made");
    if (currUser && (currUser.role == 'mod' || comData.comAuthorID == currUser.id)) {
        await deleteComment(comData.commentID);
    }
    res.redirect(`/posts/${req.params.id}`);
});

app.get("/newpost", (req, res) => {
    if (!currUser) {
        res.redirect("/login");
    } else {
        res.render("newpost.ejs", { currUser, authCheck:(currUser && currUser.role == 'mod') });
    }
});

app.post("/posts", async (req, res) => {
    const postData = req.body;
    const newPost = await addNewPost(postData.title, postData.contents, currUser.id);
    res.redirect(`posts/${newPost.id}`);
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { currUser, authCheck:(currUser && currUser.role == 'mod') });
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs", { currUser, authCheck:(currUser && currUser.role == 'mod') });
});

app.get("/logoff", (req, res) => {
    res.render("logoff.ejs", { currUser, authCheck:(currUser && currUser.role == 'mod') });
});

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

// start listening for http requests
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});