import React, { createClass } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'react-router';
import { activeLinkSelector } from 'app/selectors/challenge';
import { accessTokenSelector } from 'app/selectors/facebook';
import { setLeaderboardData, setPicture, setUser, storeAccessToken } from 'app/actions/FacebookActions';
import { facebookLogin } from 'app/utils/facebook';

const App = createClass({
    displayName: 'App',

    facebookLogin() {
        const { onStoreAccessToken } = this.props;

        facebookLogin(FB, onStoreAccessToken, this.getData);
    },

    offlineLogin() {
        this.props.onStoreAccessToken('offline');
    },

    getData() {
        const { onSetLeaderboardData, onSetPicture, onSetUser } = this.props;

        FB.api('/177389132778481/scores', response => {
            const leaderboardData = response.data;
            onSetLeaderboardData(leaderboardData);

            leaderboardData.forEach(item => {
                FB.api(`${item.user.id}/picture`, response => {
                    onSetPicture(item.user.name, response.data.url)
                });
            });
        });

        FB.api('/me', response => {
            onSetUser(response.name);
        });
    },

    renderLogin() {
        return (
            <div className="login">
                <h2>Catechism Challenge</h2>
                <button className="login__facebook" onClick={this.facebookLogin}>Log in with Facebook</button>
                <div className="login__subtext"><strong>Note:</strong> The "Post" permission simply gives permission to save your high score to Facebook so your friends can see it. This app will never post to Facebook without your consent, and you can delete your score easily at any time.</div>
                <button className="login__offline" onClick={this.offlineLogin}>Play without Facebook</button>
                <div className="login__subtext">Play without interacting with Facebook.</div>

            </div>
        );
    },

    renderLaterLogin() {
        const { accessToken } = this.props;

        if (accessToken === 'offline') {
            return <button className="login__facebook login__facebook--home" onClick={this.facebookLogin}>Login with Facebook</button>;
        }
    },

    render() {
        const { accessToken, activeLink, children } = this.props;

        if (!accessToken) { return this.renderLogin(); }

        return (
            <div>
                <nav className="main-nav">
                    <Link className="main-nav__link" to="/">Catechism Challenge</Link>
                    <div className="main-nav__menu-container">
                        <Link
                            className={`main-nav__link ${activeLink === 'challenge' ? 'main-nav__link--active' : ''}`}
                            to="/"
                        >
                            Challenge
                        </Link>
                        <Link className={`main-nav__link ${activeLink === 'practice' ? 'main-nav__link--active' : ''}`} to="practice">Practice</Link>
                        {
                            !accessToken || accessToken === 'offline'
                                ? null
                                : <Link className={`main-nav__link ${activeLink === 'leaderboard' ? 'main-nav__link--active' : ''}`} to="leaderboard">Leaderboard</Link>
                        }
                    </div>
                </nav>
                {this.renderLaterLogin()}
                {this.props.children}
                <Link className="privacy-policy__link" to="privacy-policy">Privacy Policy</Link>
            </div>
        );
    }
});

const mapStateToProps = createSelector(
    accessTokenSelector,
    activeLinkSelector,
    (accessToken, activeLink) => ({ accessToken, activeLink })
);

const mapActionsToProps = {
    onSetLeaderboardData: setLeaderboardData,
    onSetPicture: setPicture,
    onSetUser: setUser,
    onStoreAccessToken: storeAccessToken
};

export default connect(mapStateToProps, mapActionsToProps)(App);
