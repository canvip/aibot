var apiai = require('apiai');

var app = apiai("a3c53c4bdfd24f8d87641c80cc5eaebf");

var request = app.textRequest(' play music', {
    sessionId: 'newagent-3f1fc'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();

//https://botcube.co/blog/2017/02/23/tutorial-create-smart-facebook-messenger-chatbot-with-node-js-and-api-ai-nlp.html