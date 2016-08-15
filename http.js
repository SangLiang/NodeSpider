var request = require('request');

request('http://www.baidu.com/',function(error,response,body){
    if(!error && response.statusCode == 200){
        console.log(body);
        console.log(1);
    }else{
        console.log(error);
    }
});
