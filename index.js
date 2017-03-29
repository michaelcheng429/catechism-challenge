'use strict';

require('babel/register')({});
require('module-alias/register');

var server = require('./server');
var PORT = process.env.PORT || 4000;

server.listen(PORT, function() {
    console.log('Server on port ', PORT);
});
