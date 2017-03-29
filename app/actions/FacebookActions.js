import { SET_LEADERBOARD_DATA, SET_PICTURE, SET_USER, STORE_ACCESS_TOKEN } from 'app/actions/FacebookActionTypes';

export function setLeaderboardData(data) {
    return {
        type: SET_LEADERBOARD_DATA,
        payload: {
            data
        }
    };
}

export function setPicture(user, url) {
    return {
        type: SET_PICTURE,
        payload: {
            user,
            url
        }
    };
}

export function setUser(user) {
    return {
        type: SET_USER,
        payload: {
            user
        }
    };
}

export function storeAccessToken(accessToken) {
    return {
        type: STORE_ACCESS_TOKEN,
        payload: {
            accessToken
        }
    };
}
