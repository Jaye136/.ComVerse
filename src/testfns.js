import { connectionPool } from "./database.js";
import { loginUser, logoffUser, currUser } from "./auth.js";
import { addNewPost, registerUser } from "./data.js"

export async function testStuff() {
    // await restartTables();
    // await testEnvSetUp();
    // await getLoggedIn('member');
    await getLoggedIn('mod');
    // await failLogIn('password'); // expect undefined
    // await failLogIn('account'); // expect undefined
    // getLoggedOff(); // expect undefined
    // console.log(await registerUser('aa', 'bb'));
}

async function testEnvSetUp() {
    await loadTestUsers();
    await loadTestPosts();
    await loadTestTopComments();
    await loadTestNestComments();
}

async function restartTables() {
    await connectionPool.query("DROP TABLE users");
    await connectionPool.query("DROP TABLE posts");
    await connectionPool.query("DROP TABLE comments");
}

async function loadTestUsers() {
    await connectionPool.query("CALL registerUser('testuser0', 'tuser0', '00000000', 'member')");
    await connectionPool.query("CALL registerUser('betatest', 'best', '11111111', 'member')");
    await connectionPool.query("CALL registerUser('admin', 'adminster', '12312312', 'mod')");
}

async function loadTestPosts() {
    await connectionPool.query("CALL addPost('lorsum', 'lorem ipsum', '00000000', NOW(), '00000000', 'active')");
    await connectionPool.query("CALL addPost('ipum', 'lorem ipsum', '00000000', NOW(), '00000001', 'active')");
    await connectionPool.query("CALL addPost('AAAAAAAAAAAAA', 'BBBBBBBBBBBBBBBBBBB', '00000000', NOW(), '00000002', 'active')");
    await connectionPool.query("CALL addPost('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB BBBB BBBBBBBBBBBBB BBBBBBBBBBBBBBBBBBBBBBB', '00000000', NOW(), '00000003', 'active')");
}

async function loadTestTopComments() {
    await connectionPool.query("CALL addComment('EEEEEEEEEEEE', '00000000', NOW(), 'active', '00000000', 'p00000002')");
    await connectionPool.query("CALL addComment('AAA', '00000000', NOW(), 'active', '00000001', 'p00000002')");
    await connectionPool.query("CALL addComment('dffsf', '00000000', NOW(), 'active', '00000004', 'p00000002')");
    await connectionPool.query("CALL addComment('fddfdffddf', '00000000', NOW(), 'active', '00000005', 'p00000002')");
}

async function loadTestNestComments() {
    await connectionPool.query("CALL addComment('sSDDSD', '00000000', NOW(), 'active', '00000002', 'c00000000')");
    await connectionPool.query("CALL addComment('sdasdasd', '00000000', NOW(), 'active', '00000003', 'c00000000')");
    await connectionPool.query("CALL addComment('sdndnnds', '00000000', NOW(), 'active', '00000006', 'c00000000')");
}

async function getLoggedIn(perms) { // perms = 'member' or 'mod'
    if (perms == 'mod') {
        await loginUser('12312312', 'adminster');
        console.log(currUser);
    } else {
        await loginUser('00000000', 'tuser0');
        console.log(currUser);
    }
}

async function failLogIn(problem) { // problem = 'password' or 'account'
    if (perms == 'password') {
        await loginUser('12312312', 'adminer');
        console.log(currUser);
    } else {
        await loginUser('impossibl', 'tuser0');
        console.log(currUser);
    }
}

function getLoggedOff() {
    logoffUser();
    console.log(currUser);
}