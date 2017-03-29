import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from 'app/routes';
import { makeStore } from 'app/helpers';
import serverRoutes from 'app/server/routes';

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/appname');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
serverRoutes(app);

app.use((req, res) => {
    let location = createLocation(req.url);
    const store = makeStore();

    match({ routes, location }, (err, redirectLocation, renderProps) => {
        if (err) {
            console.log(err);
            return res.status(500).end('Internal server error');
        }

        if (!renderProps) {
            return res.status(404).end('Not found.');
        }

        const InitialComponent = (
            <Provider store={store}>
                <RoutingContext {...renderProps} />
            </Provider>
        );

        const initialState = store.getState();

        const componentHTML = renderToString(InitialComponent);

        const HTML = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta property="fb:app_id" content="177389132778481" />
                    <meta property="og:url" content="http://catechismchallenge.herokuapp.com/" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="I just got my highest catechism score!" />
                    <meta property="og:description" content="How far can you get?" />
                    <meta property="og:image" content="http://catechismchallenge.herokuapp.com/fb-pic1.png" /> 

                    <meta charset="utf-8">
                    <title>Catechism Challenge</title>

                    <link rel="icon" 
                          type="image/png" 
                          href="http://catechismchallenge.herokuapp.com/cc-favicon.png">
                    <link rel="stylesheet" href="/styles.css">
                    <link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">

                    <script>
                        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
                    </script>
                </head>
                <body>
                    <div id="app">${componentHTML}</div>
                    <script>
                      window.fbAsyncInit = function() {
                        FB.init({
                          appId      : '177389132778481',
                          xfbml      : true,
                          version    : 'v2.8'
                        });
                        FB.AppEvents.logPageView();
                      };

                      (function(d, s, id){
                         var js, fjs = d.getElementsByTagName(s)[0];
                         if (d.getElementById(id)) {return;}
                         js = d.createElement(s); js.id = id;
                         js.src = "//connect.facebook.net/en_US/sdk.js";
                         fjs.parentNode.insertBefore(js, fjs);
                       }(document, 'script', 'facebook-jssdk'));
                    </script>
                    <script src="/bundle.js"></script>
                </body>
            </html>
        `;

        res.end(HTML);
    });
});

export default app;
