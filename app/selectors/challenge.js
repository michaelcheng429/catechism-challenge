import { createSelector } from 'reselect';
import BOYS_GIRLS from 'app/constants/boys-girls';

export const challengeSelector = state => state.challenge;

export const activeLinkSelector = createSelector(
    challengeSelector,
    challenge => challenge.activeLink
);

export const currentQuestionSelector = createSelector(
    challengeSelector,
    challenge => BOYS_GIRLS[challenge.currentQuestion - 1] || {}
);
