import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from 'app/components/App';
import Home from 'app/components/Home';
import Practice from 'app/components/Practice';
import Leaderboard from 'app/components/Leaderboard';
import PrivacyPolicy from 'app/components/PrivacyPolicy';

export default (
    <Route component={App} path="/">
        <IndexRoute component={Home} />
        <Route component={Home} path="share/*" />
        <Route component={Practice} path="practice" />
        <Route component={Leaderboard} path="leaderboard" />
        <Route component={PrivacyPolicy} path="privacy-policy" />
    </Route>
);
