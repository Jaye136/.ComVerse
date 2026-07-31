import { connectionPool } from "./database.js";

const initFetchAmount = 15;
export let currUser;
export let fetchReqAmount = initFetchAmount; // session-specific to current user

export function setFetchReq(newnum) {
    fetchReqAmount = newnum;
}

// check if password matches the user id, if true, allow login
export async function loginUser(id, pass) {
    const [match] = await connectionPool.query('CALL fetchUser(?)', [id]);
    const matchUser = match[0];

    if (matchUser.length == 0 || matchUser[0].password != pass) {
        return false; // no match for given uuid password pair
    } else {
        currUser = matchUser[0];
        setFetchReq(initFetchAmount);
        return true;
    }
}

// set the user manually after signing them up (to avoid fetchUser call since we already have the user object)
export async function setUserSignUp(user) {
    setFetchReq(initFetchAmount);
    currUser = user;
}

export async function logoffUser() {
    setFetchReq(initFetchAmount);
    currUser = undefined;
}