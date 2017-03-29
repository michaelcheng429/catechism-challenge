import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import $ from 'jquery';
import { noop, some } from 'lodash';
import css from 'classnames';

import BOYS_GIRLS from 'app/constants/boys-girls';
import { challengeSelector, currentQuestionSelector } from 'app/selectors/challenge';
import { jumpToNumber, nextQuestion, reset, setActiveLink, setWrongIndex, toggleAnswer } from 'app/actions/ChallengeActions';
import { storeAccessToken } from 'app/actions/FacebookActions';
import { accessTokenSelector } from 'app/selectors/facebook';
import { facebookLogin } from 'app/utils/facebook';

const Practice = createClass({
    displayName: 'Practice',

    componentDidMount() {
        this.updateHeight();

        $(this.input).on('keypress', event => {
            if (event.which === 13) {
                event.preventDefault();
                this.onSubmit({ preventDefault: noop });
            }
        });
    },

    componentWillMount() {
        const { onReset, onSetActiveLink } = this.props;

        onReset();
        onSetActiveLink('practice');
    },

    updateHeight() {
        const input = this.input;

        input.style.height = 0;
        input.style.height = `${input.scrollHeight}px`;
    },

    onSubmit(event) {
        event.preventDefault();

        const { currentQuestion, onNextQuestion, onSetWrongIndex } = this.props;

        const userAnswer = this.input.value.replace(/[^a-zA-Z ]/gm, '').toLowerCase();
        const actualAnswer = currentQuestion.answer.replace(/[^a-zA-Z ]/gm, '').toLowerCase();

        if (userAnswer === actualAnswer) {
            onNextQuestion();
            this.input.value = '';
            this.updateHeight();
        } else {
            const userAnswerArray = userAnswer.split(' ');
            const actualAnswerArray = actualAnswer.split(' ');

            some(actualAnswerArray, (word, index) => {
                if (word !== userAnswerArray[index]) {
                    onSetWrongIndex(index);
                    return true;
                }
            });

            if (userAnswerArray.length > actualAnswerArray.length) {
                onSetWrongIndex(actualAnswerArray.length);
            }
        }
    },

    toggleAnswer() {
        this.props.onToggleAnswer();
        this.input.focus();
    },

    onSelectNumber(event) {
        event.preventDefault();

        this.props.onJumpToNumber(Number(this.selectNumber.value));
        this.input.value = '';
        this.selectNumber.value = '';
        this.updateHeight();
        this.input.focus();
    },

    renderDiff() {
        const { currentQuestion, wrongIndex } = this.props;

        if (wrongIndex === null) { return null; }

        return (
            <div className="challenge__answer">
                {
                    currentQuestion.answer.split(' ').map((word, index) => {
                        return (
                            <span
                                key={index}
                                className={index >= wrongIndex ? 'challenge__wrong-word' : ''}
                            >
                                {`${word} `}
                            </span>
                        );
                    })
                }
            </div>
        )
    },
    
    render() {
        const { currentQuestion, wrongIndex } = this.props;

        const inputClassNames = css('challenge__input', {
            'challenge__input--error': wrongIndex !== null && wrongIndex !== 999
        });

        return (
            <div className="challenge">
                <div className="challenge__container">
                    <div className="challenge__question">{`${currentQuestion.id}. ${currentQuestion.question}`}</div>
                    <form onSubmit={this.onSubmit}>
                        <textarea
                            type="text"
                            className={inputClassNames}
                            onChange={this.updateHeight}
                            placeholder="Enter your answer here"
                            ref={input => this.input = input}
                        />
                    </form>
                    {this.renderDiff()}

                    <div className="practice__actions">
                        <button className="challenge__reset" onClick={this.toggleAnswer}>
                            {`${wrongIndex === null ? 'Show' : 'Hide'} Answer`}
                        </button>
                        <form className="practice__select-form" onSubmit={this.onSelectNumber}>
                            <input
                                type="text"
                                className="practice__select"
                                placeholder="Jump to number"
                                ref={input => this.selectNumber = input}
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = createSelector(
    accessTokenSelector,
    challengeSelector,
    currentQuestionSelector,
    (accessToken, challenge, currentQuestion) => ({ ...challenge, accessToken, currentQuestion })
);

const mapActionsToProps = {
    onJumpToNumber: jumpToNumber,
    onNextQuestion: nextQuestion,
    onReset: reset,
    onSetActiveLink: setActiveLink,
    onSetWrongIndex: setWrongIndex,
    onStoreAccessToken: storeAccessToken,
    onToggleAnswer: toggleAnswer
};

export default connect(mapStateToProps, mapActionsToProps)(Practice);
