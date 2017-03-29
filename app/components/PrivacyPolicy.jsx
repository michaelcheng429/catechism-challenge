import React, { createClass } from 'react';

const PrivacyPolicy = createClass({
    displayName: 'PrivacyPolicy',

    render() {
        return (
            <div className="privacy-policy">
                <h2>Privacy Policy</h2>
                <p>This app will keep track of your top score, and your friends will be able to see this score. You may choose to remove this score if you want.</p>

                <p>You may choose to share your top score on Facebook.</p>
            </div>
        );
    }
});

export default PrivacyPolicy;
