var request = require('request');
var cheerio = require('cheerio');

var getDate = function(html) {
	var $ = cheerio.load(html);
	console.log($('.fcon').length);
}

request('http://www.aiqitu.cn/',function(error,response,body){
    if(!error && response.statusCode == 200){
        console.log(body);
        getDate(body);
    }else{
        console.log(error);
    }
});

