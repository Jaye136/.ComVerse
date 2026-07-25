import express from "express";
import { addNewPost, addTopComment, loadAllComments, loadPost, refreshPosts } from "./data.js";
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
    res.render("fpage.ejs", { postList, currUser }
    );
});

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const loadResult = await loadPost(id);

    if (loadResult.length == 0) {
        return res.status(404).render("post404.ejs", { currUser });
    }
    
    const post = loadResult[0];
    const poster = loadResult[1];
    const commentChunks = await loadAllComments(post);
    res.render("post.ejs", { post, poster, commentChunks, currUser, authCheck: (currUser.role == 'mod') });
});

app.get("/newpost", (req, res) => {
    if (!currUser) {
        res.redirect("/login");
    } else {
        res.render("newpost.ejs", { currUser });
    }
});

app.post("/posts", async (req, res) => {
    const postData = req.body;
    const newPost = await addNewPost(postData.title, postData.contents, currUser.id);
    res.redirect(`posts/${newPost.id}`);
});

app.post("/posts/:id", async (req, res) => {
    const comData = req.body;
    console.log(comData);
    if (comData.parType == 'p') {
        await addTopComment(comData.comment, currUser.id, comData.parent);
    }
    res.redirect(`/posts/${req.params.id}`);
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { currUser });
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs", { currUser });
});

app.get("/logoff", (req, res) => {
    res.render("logoff.ejs", { currUser });
});

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

// start listening for http requests
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});