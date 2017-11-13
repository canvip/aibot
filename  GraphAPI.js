//canvip

//مرجع بس 
git push --set-upstream W-Bot master
 //"passport": "~0.3.2",
   // "passport-facebook": "~2.1.1",
//http://lorenstewart.me/2017/03/12/using-node-js-to-interact-with-facebooks-graph-api/
'use strict';
const express = require('express'),
      bodyParser = require('body-parser','request-promise'),
      path = require('path'),
      payload = {  
  queryTerm: 'Fiat',
  searchType: 'page'
};


const request = require('request-promise');

module.exports = (app) => {

  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  const userFieldSet = 'name, link, is_verified, picture';
  const pageFieldSet = 'name, category, link, picture, is_verified';


  app.post('/facebook-search', (req, res) => {
    const  { queryTerm, searchType } = req.body;

    const options = {
      method: 'GET',
      uri: 'https://graph.facebook.com/search',
      qs: {
        access_token: config.user_access_token,
        q: queryTerm,
        type: searchType,
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
}

app.get('/facebook-search/:id', (req, res) => {

  // you need permission for most of these fields
  const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';

  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v2.8/${req.params.id}`,
    qs: {
      access_token: user_access_token,
      fields: userFieldSet
    }
  };
  request(options)
    .then(fbRes => {
      res.json(fbRes);
    })
})