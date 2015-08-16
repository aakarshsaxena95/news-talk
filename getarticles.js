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
    
  });
// }, the_interval);