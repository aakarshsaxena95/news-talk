var Article = require('./models/article.js');
var request = require('request');
// var minutes = .1, the_interval = minutes * 60 * 1000;
// setInterval(function() {
  url = 'http://api.nytimes.com/svc/topstories/v1/home.jsonp?api-key=c6d1eca37b6784fb7388b1095098fdd9:1:72686982'; 
  var getJsonFromJsonP = function (url, callback) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonpData = body;
        var json;
        try{
           json = JSON.parse(jsonpData);
        }
        catch(e){
            var startPos = jsonpData.indexOf('({');
            var endPos = jsonpData.indexOf('})');
            var jsonString = jsonpData.substring(startPos+1, endPos+1);
            json = JSON.parse(jsonString);
        }
        callback(null, json);
      }
      else{
        callback(error);
      }
    })
  }
  getJsonFromJsonP(url, function (err, data) {
    data.results.forEach(function(article){
      console.log(article);
      Article.findOne({timestamp:article.created_date},function(err,found){
        if (err){
          console.log('Error in finding article: '+err);
          return done(err);
        }
        if (found) {
        } 
        else{
          console.log(article);
          var newArticle = new Article();
          newArticle.section = article.section;
          newArticle.title = article.title;
          newArticle.abstract = article.abstract;
          newArticle.url = article.url.replace('\\','');

          article.multimedia.forEach(function(image){
            newArticle.images.append = {
              url: image.url,
              caption: image.url
            };
          });
          newArticle.votes = {up:[],down:[]};
          newArticle.comments = [];
          newArticle.timestamp = article.created_date;
          newArticle.save(function(err) {
            console.log("in save");
            if (err){
              console.log('Error in Saving article: '+err);  
              throw err;  
            }
            console.log("Created new Article "+newArticle);    
          });
        }});
});
});
// }, the_interval);