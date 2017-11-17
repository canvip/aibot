//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express'),
bodyParser = require('body-parser'),
request = require('request'),
path = require('path'),
jsdom = require("jsdom"),
{ JSDOM } = jsdom,
cheerio = require('cheerio'),
      $ = cheerio.load('<ul id="fruits">...</ul>', {
    normalizeWhitespace: true,
    xmlMode: true
});



/*_______________________canvip_Ai______start_________________
const crypto = require('crypto'),
//const express = require('express');
 fetch = require('node-fetch');
//const request = require('request');

let Wit = null,
 log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}
const WIT_TOKEN = process.env.WIT_Server_Access_Token,
      PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
if (!PAGE_ACCESS_TOKEN) { throw new Error('missing PAGE_ACCESS_TOKEN') }
const APP_SECRET = process.env.APP_SECRET;
if (!APP_SECRET) { throw new Error('missing APP_SECRET') }
let FB_VERIFY_TOKEN = null;
crypto.randomBytes(8, (err, buff) => {
  if (err) throw err;
  FB_VERIFY_TOKEN = buff.toString('hex');
  console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}  الله اكبر"`);
});

const fbMessage = (id, text) => {
  const body = JSON.stringify({
    recipient: { id },
    message: { text },
  });
  const qs = 'access_token=' + encodeURIComponent(PAGE_ACCESS_TOKEN);
  return fetch('https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
  .then(rsp => rsp.json())
  .then(json => {
    if (json.error && json.error.message) {
      throw new Error(json.error.message);
    }
    return json;
  });
};



_______________________canvip_Ai_______end________________*/

//canvip updata


const MongoClient = require('mongodb').MongoClient; // npm install mongoose connect-mongo --save
const assert = require('assert');

const scrapingfunc = require('./scrapingfunc');
//const graphAPI = require('./GraphAPI');

//var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://www.facebook.com/Wazzayfer-1576310479088018/\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



// Configure view engine to render EJS templates.
const routes = require('./routes/conf.routes'),//canvip add a routes
passport = require('./OAuth/conf.Login');//canvip add a OAuth/conf.Login'fix error login url
app.set('views', path.join(__dirname, 'views'));//canvip
//app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/', routes);

//const funz = require('./funz');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));



// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);   
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});






function ValidURL(str) {
    var validUrl = require('valid-url');
    return validUrl.isUri(str);
}


function getYCombinatorNews(callback)
{
  var scraperjs = require('scraperjs');
   scraperjs.StaticScraper.create('https://news.ycombinator.com/')
      .scrape(function($) {
          return $(".storylink").map(function() { 
              return [$(this).text(),ValidURL($(this).attr("href"))?$(this).attr("href"):'https://news.ycombinator.com/'+$(this).attr("href")];
          }).get();
      })
      .then(callback)
}
function getWuzzufJobs(callback,searchstring='test')
{
  var scraperjs = require('scraperjs');
   scraperjs.StaticScraper.create('https://wuzzuf.net/search/jobs/?q='+encodeURIComponent(searchstring.replace(' ','+')))
      .scrape(function($) {
          return $(".job-title a").map(function() {
              var jobtitle=$(this).text();
              var jobLink=$(this).attr('href');
              var timeago=$(this).parent().parent().find('.date time').text().trim() //get how many days/months ago
              var timestamp=$(this).parent().parent().find('.date time').attr('datetime') //posting timestamp
              var timehuman=$(this).parent().parent().find('.date time').attr('title') //posting time
              var companyname=$(this).parent().parent().parent().find('.company-meta .company-name a span[itemprop="name"]').text() //get company name
              var companymore=$(this).parent().parent().parent().find('.company-meta .company-name a').attr('href') //get more jobs by company (link)
              var companylogo=$(this).parent().parent().parent().find('.company-meta .company-name meta[itemprop="logo"]').attr('content') //get company logo (link to img)
              var companyimg=$(this).parent().parent().parent().find('.company-meta .company-name meta[itemprop="image"]').attr('content') //get company logo image (link to img)
              var jobLocation=$(this).parent().parent().parent().find('.company-meta span[itemprop="jobLocation"] span[itemprop="name"]').first().text() //get job location
              var jobEmploymentType=$(this).parent().parent().parent().find('.job-details span[itemprop="employmentType"] a').text().trim() //get job type [Full Time, Part Time...]
              var jobEmploymentTypemore=$(this).parent().parent().parent().find('.job-details span[itemprop="employmentType"] a').attr('href') //get similar jobs to this type (link)
              var jobExperienceRequirements=$(this).parent().parent().parent().find('.job-details span[itemprop="experienceRequirements"]').attr('title') //get Experience Requirements
              var jobCategories=$(this).parent().parent().parent().find('.job-details span[itemprop="occupationalCategory"] a').map(function() {return {name:$(this).text(),more:$(this).attr('href')};} );
              var jobJSON={
                timeago:timeago,timestamp:timestamp,timehuman:timehuman,
                company:{name:companyname,more:companymore,logo:companylogo,img:companyimg},
                job:{title:jobtitle,link:jobLink,location:jobLocation,employmentType:jobEmploymentType,employmentTypemore:jobEmploymentTypemore,experienceRequirements:jobExperienceRequirements,categories:jobCategories}
              };
              return [jobtitle,jobLink,jobJSON];
          }).get();
      })
      .then(callback)
}



// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    switch (messageText.toLowerCase()) {
      case 'help':
        sendTextMessage(senderID,'Usage: Type one of the following commands'
        +'\n'+'ycombinator\tYCombinator News'
        +'\n'+'wuzzuf\tWuzzuf Test Jobs'
        +'\n'+'generic\tOculus Rift'
        +'\n'+'Anything else will be echoed back!!');
        break;
      case 'ycombinator':
        getYCombinatorNews(function(news){
        var payload={
          template_type: "generic",
          elements: []
        }
        var l=news.length;
        for(var i=0;i<l && i<20;i+=2)
        {
          payload.elements.push({
            title: news[i],
            subtitle: news[i],
            item_url: news[i+1],
            buttons:[{
              type: "web_url",
              url: news[i+1],
              title: "Open Web URL"
            }]
          });
        }
          var messageData=prepareGenericMessage(senderID,payload);
          callSendAPI(messageData);
        });
        break;
      case 'wuzzuf': case 'yes': case 'si': case 'ya': case 'ys': case 'ye': case 'aywa': case 'ah':
      case 'ايوة': case 'اه': case 'نعم':
        sendWuzzufJobs(senderID,'test');
        break;
      case 'generic':
        sendGenericMessage(senderID);
        break;
      case 'hello': case 'hi': case 'hey': case 'assalamu alaikum': case 'aloha': case 'lo': case 'hllo': case 'ih':
      case 'olleh': case 'peace': case 'ezayak': case 'helo': case 'halo': case 'hellow': case 'السلام عليكم':
      case 'سلام عليكم': case 'ازيك': case 'الو': case 'الو الو':
        sendMultipleTextMessages(senderID, ['Hello, this is Wazzayfer', 'Would you like to start a job search?']);
        break;
      default:
        if(messageText.toLowerCase().startsWith("search for "))
          sendWuzzufJobs(senderID,messageText.toLowerCase().replace('search for ',''));
        else
          sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}

//////////////////////////
// Sending helpers
//////////////////////////

function sendWuzzufJobs(senderID,searchtext='test')
{
      getWuzzufJobs(function(jobs){
        var payload={
          template_type: "generic",
          elements: []
        }
        var l=jobs.length;
        for(var i=0;i<l && i<20;i+=3)
        {
          var job=jobs[i+2];
          var buttons=[];
          if(jobs[i+1])
            buttons.push({
              type: "web_url",
              url: jobs[i+1],
              title: "Open Job Details"
            });
          if(job.job.employmentTypemore)
            buttons.push({
              type: "web_url",
              url: job.job.employmentTypemore,
              title: "more "+job.job.employmentType+" Jobs"
            });
          if(job.company.more)
            buttons.push({
              type: "web_url",
              url: job.company.more,
              title: "more Jobs at "+job.company.name
            });
          payload.elements.push({
            title: jobs[i]+'('+job.company.name+')',
            subtitle: 'Posted '+job.timeago+' ,'+job.job.employmentType+' in '+job.job.location,
            item_url: jobs[i+1],
            image_url: job.company.img,
            buttons:buttons
          });
        }
          var messageData=prepareGenericMessage(senderID,payload);
          callSendAPI(messageData);
        },searchtext); //any search string
}

function sendMultipleTextMessages(recipientId, messageTextArray,i=0,callback=null) {
  var noofmessages=messageTextArray.length;
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageTextArray[i]
    }
  };
  if(i<noofmessages)
  callSendAPI(messageData,function(error,response,body){
    sendMultipleTextMessages(recipientId,messageTextArray,i+1,callback);
    if(callback!=null) callback(error,response,body);
  });
}

function sendTextMessage(recipientId, messageText,callback=null) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData,callback);
}

function prepareGenericMessage(recipientId,payload){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: payload
      }
    }
  }; 
  return messageData;
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "https://scontent.oculuscdn.com/v/t64.5771-25/11162760_1760656900837466_289201984_n.jpg?oh=799cffdf9f7327fe57503d3a2fc495c8&oe=59C37311",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "https://scontent-frt3-1.xx.fbcdn.net/v/t39.2365-6/17636575_1728999024057153_2879955153140580352_n.jpg?oh=8837bb3a12ffa6c6fdf80ba3eacebdcf&oe=5A197658",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function callSendAPI(messageData,callback=null) {
  request({
    uri: 'https://graph.facebook.com/v2.10/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
    if(callback!=null)
      callback(error,response,body);
  });  
}


function getDetailsFromFacebook  (userId, callback)  {
  request(
    {
      method: 'GET',
      url: `https://graph.facebook.com/v2.10/me/${userId}`,
      json: true,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        
        fields: 'id,name,about,locale,education,email,birthday,favorite_teams,website',
        
      },
    },
    callback,
    console.log('getDetailsFromFacebook')
  );
};




const getdetailsFromFacebook = (userId, callback) => {
  request(
    {
      method: 'GET',
      url: `https://graph.facebook.com/v2.6/${userId}`,
      json: true,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        // facebook requires the qs in the format
        // fields=a,b,c not fields=[a,b,c]
        fields: 'first_name,last_name,profile_pic',
      },
    },
    callback
    
  );
};


// Set Express to listen out for HTTP requests
let server = app.listen(process.env.PORT || 8080, function () {
  console.log("Listening on port %s", server.address().port);
});


