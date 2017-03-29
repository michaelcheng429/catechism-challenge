import { createSelector } from 'reselect';
import { find, get } from 'lodash';

export const facebookSelector = state => state.facebook;

export const accessTokenSelector = createSelector(
    facebookSelector,
    facebook => facebook.accessToken
);
export const isLoggedInSelector = createSelector(
    facebookSelector,
    facebook => facebook.accessToken && facebook.accessToken !== 'offline'
);

export const leaderboardDataSelector = createSelector(
    facebookSelector,
    facebook => facebook.leaderboardData
);

export const picturesSelector = createSelector(
    facebookSelector,
    facebook => facebook.pictures
);

export const userSelector = createSelector(
    facebookSelector,
    facebook => facebook.user
);

export const userDataSelector = createSelector(
    userSelector,
    leaderboardDataSelector,
    picturesSelector,
    (user, leaderboardData, pictures) => {
        const scoreData = find(leaderboardData, item => item.user.name === user);

        return {
            name: user,
            score: get(scoreData, 'score') || 0,
            url: pictures[user]
        };
    }
);
