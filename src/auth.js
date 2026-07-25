import { connectionPool } from "./database.js";

const initFetchAmount = 20;
export let currUser;
export let fetchReqAmount = initFetchAmount; // session-specific to current user

export function setFetchReq(newnum) {
    fetchReqAmount = newnum;
}

// check if password matches the user id, if true, allow login
export async function loginUser(id, pass) {
    // if (id.length > 12 || pass.length > 12) // tell user that either id or password is of invalid length || should be caught BEFORE loginUser is called
    //     throw new Error('Username or password invalid: exceeded 12 characters');

    const [match] = await connectionPool.query('CALL fetchUser(?)', [id]);
    const matchuser = match[0];

    if (matchuser.length == 0) // tell user there is no user by that id
        throw new Error('No user by that id exists');
    if (matchuser[0].password != pass) // tell user the password is incorrect
        throw new Error('Incorrect password');
    
    currUser = matchuser[0];
    setFetchReq(initFetchAmount);
    // successful login, refresh page
}

export async function logoffUser() {
    currUser = undefined;
}

// deprecated, now checks user information directly
// // check if user has permission to view ids of users
// export function canSeeIdentity() {
//     if (currUser === undefined) return false;
//     if (currUser.role == 'member') return false;
//     return true;
// }

// // check if user has permission to view promotion/demotion function
// export function canProDemote() {
//     if (currUser === undefined) return false;
//     if (currUser.role == 'member') return false;
//     return true;
// }

// // check if user can delete comment regardless if they're the author
// export function canDelCom() {
//     if (currUser === undefined) return false;
//     if (currUser.role == 'mod') return true;
//     return false;
// }

// // check if user can delete posts regardless if they're the author
// export function canDelPost() {
//     if (currUser === undefined) return false;
//     if (currUser.role == 'mod') return true;
//     return false;
// }