var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var mysql = require('mysql');
var sqlseeting = require('./src/dbconfig.js');
var connection = mysql.createConnection(sqlseeting);
var searchUrl = "http://cs.fang.anjuke.com/loupan/yuelu/p1/";
var id = 0;

connection.connect();

function getDate(html) {
    var $ = cheerio.load(html);
    var length = $('.items-name').length;
    var priceLength = $('.price').length;

    console.log("价格数量" + priceLength);
    console.log("位置地址" + $('.address').length);
    for (var i = 0; i < length; i++) {
        var _placeName = $('.items-name').eq(i).text();
        var _price = $('.price').eq(i).text();
        var _position = $('.address').eq(i).find("a").text();

        ++id;

        var insertObj = {
            "id": id,
            "name": _placeName,
            "money": _price,
            "position": _position
        };
        writeInSql(insertObj);
    }
}

function writeInSql(obj) {
    connection.query('insert into main set ?', obj, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log('\n');
    });
}

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
