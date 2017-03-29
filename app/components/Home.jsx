import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import $ from 'jquery';
import { noop, some } from 'lodash';
import css from 'classnames';

import { Link } from 'react-router';
import { challengeSelector, currentQuestionSelector } from 'app/selectors/challenge';
import { accessTokenSelector, isLoggedInSelector, userDataSelector } from 'app/selectors/facebook';
import { nextQuestion, reset, setActiveLink, setWrongIndex } from 'app/actions/ChallengeActions';
import { setLeaderboardData, storeAccessToken } from 'app/actions/FacebookActions';
import { facebookLogin } from 'app/utils/facebook';

const Home = createClass({
    displayName: 'Home',

    componentWillMount() {
        const { onReset, onSetActiveLink } = this.props;

        onReset();
        onSetActiveLink('challenge');
    },

    componentDidMount() {
        this.updateHeight();

        $(this.input).on('keypress', event => {
            if (event.which === 13) {
                event.preventDefault();
                this.onSubmit({ preventDefault: noop });
            }
        });
    },

    updateHeight() {
        const input = this.input;

        input.style.height = 0;
        input.style.height = `${input.scrollHeight}px`;
    },

    share() {
        FB.ui({
            method: 'share',
            href: `catechismchallenge.herokuapp.com`
        });
    },

    deleteScore() {
        const { onSetLeaderboardData } = this.props;

        if (typeof window !== 'undefined') {
            const confirm = window.confirm('Are you sure you want to delete your score?');

            if (confirm) {
                FB.api('/me/scores', 'delete', response => {
                    FB.api('/me/scores', response => {
                        const leaderboardData = response.data;
                        onSetLeaderboardData(leaderboardData);
                    });
                });
            }
        }
    },

    onSubmit(event) {
        event.preventDefault();

        const { currentQuestion, isLoggedIn, onNextQuestion, onSetLeaderboardData, onSetWrongIndex, userData } = this.props;

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

            const score = currentQuestion.id === 135 ? 135 : currentQuestion.id - 1;

            if (isLoggedIn && score > userData.score) {
                FB.api('/me/scores', 'post', { score }, response => {
                    FB.api('/177389132778481/scores', response => {
                        const leaderboardData = response.data;
                        onSetLeaderboardData(leaderboardData);
                    });
                });
            }


        }

    },

    onReset() {
        this.input.value = '';
        this.props.onReset();
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

    renderReset() {
        if (this.props.wrongIndex === null) { return null; }


        return (
            <div>
                <button className="challenge__reset" onClick={this.onReset}>Reset</button><br />
                <button className="challenge__reset challenge__practice-link"><Link to="practice">Go to practice mode</Link></button>
            </div>
        );
    },

    renderUserData() {
        const { accessToken, userData } = this.props;
        const { name, score, url } = userData;

        if (!accessToken || accessToken === 'offline') { return null; }

        return (
            <div className="challenge__user-data-container">
                <div className="challenge__user-data">
                    <img className="leaderboard__card-picture" src={url} />
                    <div className="challenge__user-high-score">Highest Score: <strong><em>{` Question #${score}`}</em></strong></div>
                    <div className="fb-share" onClick={this.share}><div className="ico" />Share</div>
                    <img
                        className="challenge__delete-score"
                        onClick={this.deleteScore}
                        src="./x-icon.png"
                        title="Delete score (and remove from Leaderboard)"
                    />
                </div>
            </div>
        );
    },
    
    render() {
        const { currentQuestion, userData, wrongIndex } = this.props;
        const { name, score, url } = userData;

        const inputClassNames = css('challenge__input', {
            'challenge__input--error': wrongIndex !== null
        });

        return (
            <div className="challenge">
                {this.renderUserData()}
                <div className="challenge__container">
                    <div className="challenge__question">{`${currentQuestion.id}. ${currentQuestion.question}`}</div>
                    <form onSubmit={this.onSubmit}>
                        <textarea
                            type="text"
                            className={inputClassNames}
                            disabled={wrongIndex !== null}
                            onChange={this.updateHeight}
                            placeholder="Enter your answer here"
                            ref={input => this.input = input}
                        />
                    </form>
                    {this.renderDiff()}
                    {this.renderReset()}
                </div>

            </div>
        );
    }
});

const mapStateToProps = createSelector(
    accessTokenSelector,
    challengeSelector,
    currentQuestionSelector,
    isLoggedInSelector,
    userDataSelector,
    ( accessToken, challenge, currentQuestion, isLoggedIn, userData) => ({ ...challenge, accessToken,  currentQuestion, isLoggedIn, userData })
);

const mapActionsToProps = {
    onNextQuestion: nextQuestion,
    onReset: reset,
    onSetActiveLink: setActiveLink,
    onSetLeaderboardData: setLeaderboardData,
    onSetWrongIndex: setWrongIndex,
    onStoreAccessToken: storeAccessToken
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
