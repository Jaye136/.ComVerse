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

// set the user manually after signing them up (to avoid fetchUser call since we already have the user object)
export async function setUserSignUp(user) {
    currUser = user;
}

export async function logoffUser() {
    currUser = undefined;
}