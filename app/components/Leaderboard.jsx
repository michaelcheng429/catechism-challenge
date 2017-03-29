import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { find } from 'lodash';
import BOYS_GIRLS from 'app/constants/boys-girls';
import { setActiveLink } from 'app/actions/ChallengeActions';
import { leaderboardDataSelector, picturesSelector, userDataSelector } from 'app/selectors/facebook';
import { setLeaderboardData } from 'app/actions/FacebookActions';

const Leaderboard = createClass({
    displayName: 'Leaderboard',

    componentWillMount() {
        const { onSetActiveLink } = this.props;

        onSetActiveLink('leaderboard');
    },

    deleteScore() {
        const { onSetLeaderboardData } = this.props;

        if (typeof window !== 'undefined') {
            const confirm = window.confirm('Are you sure you want to delete your score?');

            if (confirm) {
                FB.api('/me/scores', 'delete', response => {
                    FB.api('/177389132778481/scores', response => {
                        const leaderboardData = response.data;
                        onSetLeaderboardData(leaderboardData);
                    });
                });
            }
        }
    },

    render() {
        const { leaderboardData, pictures, userData } = this.props;

        return (
            <div className="leaderboard">
                {
                    leaderboardData.map((item, index) => {
                        return (
                            <div key={item.user.name} className="leaderboard__card">
                                <div className="leaderboard__card-rank">{`#${index + 1}`}</div>
                                <img src={pictures[item.user.name]} className="leaderboard__card-picture" />
                                <div className="leaderboard__card-name">{item.user.name}</div>
                                <div className="leaderboard__card-data">
                                    <div className="leaderboard__card-label">Question:</div>
                                    <div className="leaderboard__card-question" title={BOYS_GIRLS[item.score -1].question}>
                                        {`${item.score}) ${BOYS_GIRLS[item.score -1].question}`}
                                    </div>
                                </div>
                                {
                                    item.user.name === userData.name
                                        ? (
                                            <img
                                                className="challenge__delete-score"
                                                onClick={this.deleteScore}
                                                src="./x-icon.png"
                                                title="Delete your score"
                                            />
                                        )
                                        : null
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
});

const mapStateToProps = createSelector(
    leaderboardDataSelector,
    picturesSelector,
    userDataSelector,
    (leaderboardData, pictures, userData) => ({ leaderboardData, pictures, userData })
);

const mapActionsToProps = {
    onSetActiveLink: setActiveLink,
    onSetLeaderboardData: setLeaderboardData
};

export default connect(mapStateToProps, mapActionsToProps)(Leaderboard);
