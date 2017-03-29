import { noop } from 'lodash';

export function facebookLogin(FB, onStoreAccessToken, callback) {
    callback = callback || noop;

    FB.login(response => {
        onStoreAccessToken(response.authResponse.accessToken);
        callback();
    }, {
        scope: ['public_profile', 'user_games_activity', 'publish_actions', 'user_friends'],
        return_scopes: true
    });
}
