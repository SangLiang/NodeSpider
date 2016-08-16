var request = require('request');
var cheerio = require('cheerio');

request('http://www.wangdabl.com/',function(error,response,body){
    if(!error && response.statusCode == 200){
        console.log(body);
    }else{
        console.log(error);
    }
});

console.warn(cheerio);