import { SET_LEADERBOARD_DATA, SET_PICTURE, SET_USER, STORE_ACCESS_TOKEN } from 'app/actions/FacebookActionTypes';

const defaultState = {
    accessToken: null,
    leaderboardData: [],
    pictures: {},
    user: ''
};

export default function facebookReducer(state = defaultState, { type, payload }) {
    switch (type) {
        case STORE_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: payload.accessToken
            };
        case SET_LEADERBOARD_DATA:
            return {
                ...state,
                leaderboardData: payload.data
            };
        case SET_PICTURE:
            return {
                ...state,
                pictures: {
                    ...state.pictures,
                    [payload.user]: payload.url
                }
            };
        case SET_USER:
            return {
                ...state,
                user: payload.user
            };
        default:
            return state;
    }
}
