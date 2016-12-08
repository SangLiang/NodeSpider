var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var mysql = require('mysql');
var sqlseeting = require('./src/dbconfig.js');
var connection = mysql.createConnection(sqlseeting);
var searchUrl = "http://cs.fang.anjuke.com/loupan/yuelu/p1/";
var id = 0;

connection.connect();

connection.query("DROP TABLE IF EXISTS yuelu",function(err,result){
    if (err) throw err;
});

function getDate(html) {
    var $ = cheerio.load(html);
    var length = $('.items-name').length;
    var priceLength = $('.price').length;
    var itemLenth = $(".item-mod").length;
    var nextPage = $(".next-page");

    for (var i = 0; i < itemLenth; i++) {
        var _placeName = $(".item-mod").eq(i).find(".items-name").text();
        var _price = $(".item-mod").eq(i).find(".price").text();
        var _position =  $(".item-mod").eq(i).find(".address").text();
        ++id;

        var insertObj = {
            "id": id,
            "name": _placeName,
            "money": _price,
            "position": _position
        };

        // 执行插入
        writeInSql(insertObj);
    }
     console.log(nextPage.attr("href"));
        setTimeout(function(){
            if(nextPage.attr("href")!=undefined){
                searchUrl = nextPage.attr("href");
                Init();
            }else{
                console.log("爬虫执行完毕");
                return;
            }
        },500);
}

function writeInSql(obj) {
    if(!obj.name){return;}

    connection.query("CREATE TABLE IF NOT EXISTS yuelu(id int not null primary key,name varchar(255),money varchar(255),position varchar(255))",function(err,result){
        if(err){
            throw err;
        }else{
            connection.query('insert into yuelu set ?', obj, function (err, result) {
                if (err) throw err;
            });
        }
    });
}

function Init(){
    request(
        {
            encoding: null,
            url: searchUrl
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var buf = iconv.decode(body, 'utf8').toString();//编码设置
                getDate(buf);
            } else {
                console.log(error);
            }
        }
    );
}

Init();

