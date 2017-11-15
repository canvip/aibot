var apiai = require('apiai');

var app = apiai("a3c53c4bdfd24f8d87641c80cc5eaebf");

var request = app.textRequest('اهلا', {
    sessionId: 'newagent-3f1fc'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();