var express = require('express'),
   
      router = express.Router(),
      bodyParser = require('body-parser','request-promise'),
      path = require('path'),
      payload = {  
  queryTerm: 'Fiat',
  searchType: 'page'
};
var compression = require('compression') //https://varvy.com/pagespeed/
var mcache = require('memory-cache');

const passport = require('passport'),
      Strategy = require('passport-facebook').Strategy;
router.use(compression())//npm install compression --canvip
router.use(passport.initialize());
router.use(passport.session());

//router.use(express.static(__dirname + '/node_modules'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' ,user: req.user})
    
}),
  
  router.get('/login',function(req, res){
    res.render('login',{ title: 'Express' });
  }),
  
  router.get('/pwa',function(req, res){
    res.render('pwa',{ title: 'Express' });
  }),
  router.get('/amp',function(req, res){
    res.render('amp',{ title: 'Express' });
  }),
  
  router.get('/login/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile','email', 'user_friends']
  })),
  
  router.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }),
  
  router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });



    

const request = require('request-promise');


  const userFieldSet = 'name, link, is_verified, picture';
  const pageFieldSet = 'name, category, link, picture, is_verified';

router.post('/facebook-search', (req, res) => {
    const  { queryTerm, searchType } = req.body;

    const options = {
      method: 'GET',
      uri: 'https://graph.facebook.com/search',
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN ,
        q: queryTerm,
        type: searchType,
        json: true,
        fields: searchType === 'page' ? pageFieldSet : userFieldSet
      }
    };

    request(options)
      .then(fbRes => {
// Search results are in the data property of the response.
// There is another property that allows for pagination of results.
// Pagination will not be covered in this post,
// so we only need the data property of the parsed response.
        const parsedRes = JSON.parse(fbRes).data; 
        res.json(parsedRes);
      })
  });




router.get('/get/:id', (req, res) => {

  // you need permission for most of these fields
  const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
//id,name,about,locale,education,email,birthday,favorite_teams,website
  //'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed'
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.10/${req.params.id}`,
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN ,
      fields: userFieldSet,
      json: true
    }
  };
  request(options)
    .then(fbRes => {
      res.json(fbRes);
    })
})

module.exports = router;

