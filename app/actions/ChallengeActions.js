import {
    JUMP_TO_NUMBER,
    NEXT_QUESTION,
    RESET,
    SET_ACTIVE_LINK,
    SET_WRONG_INDEX,
    TOGGLE_ANSWER
} from 'app/actions/ChallengeActionTypes';

export function jumpToNumber(number) {
    return {
        type: JUMP_TO_NUMBER,
        payload: {
            number
        }
    };
}

export function nextQuestion() {
    return {
        type: NEXT_QUESTION
    };
}

export function reset() {
    return {
        type: RESET
    };
}

export function setActiveLink(link) {
    return {
        type: SET_ACTIVE_LINK,
        payload: {
            link
        }
    };
}

export function setWrongIndex(index) {
    return {
        type: SET_WRONG_INDEX,
        payload: {
            index
        }
    };
}

export function toggleAnswer() {
    return {
        type: TOGGLE_ANSWER
    };
}
