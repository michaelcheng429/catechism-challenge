import {
    JUMP_TO_NUMBER,
    NEXT_QUESTION,
    RESET,
    SET_ACTIVE_LINK,
    SET_WRONG_INDEX,
    TOGGLE_ANSWER
} from 'app/actions/ChallengeActionTypes';

const defaultState = {
    activeLink: 'challenge',
    currentQuestion: 1,
    wrongIndex: null
};

export default function challengeReducer(state = defaultState, { type, payload }) {
    switch(type) {
        case JUMP_TO_NUMBER:
            return {
                ...state,
                currentQuestion: payload.number,
                wrongIndex: null
            };
        case NEXT_QUESTION:
            return {
                ...state,
                currentQuestion: state.currentQuestion + 1,
                wrongIndex: null
            };
        case RESET:
            return {
                ...state,
                currentQuestion: 1,
                wrongIndex: null
            };
        case SET_ACTIVE_LINK:
            return {
                ...state,
                activeLink: payload.link
            };
        case SET_WRONG_INDEX:
            return {
                ...state,
                wrongIndex: payload.index
            };
        case TOGGLE_ANSWER:
            return {
                ...state,
                wrongIndex: state.wrongIndex === null ? 999 : null
            };
        default:
            return state;
    }
}
