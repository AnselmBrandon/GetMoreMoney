console.log('=====排程啟動=====');
console.log(Date.now());
const { Client } = require('pg');

    
//排程啟動
var linebot = require('linebot');
//var express = require('express');
//var request = require('request');

var bot = linebot({
    channelId: '1585073032',
    channelSecret: 'e0acb451ddc1d0b89f5e051f78f52739',
    channelAccessToken: 'llr0iuNKZNnNvDXKQ5SpBGUVSCGM1FxOwEWKFAbiX45ZbKYZVzbLt67TcDwhgjISuTvIdMstBWVpfADfORx7cT0/97Tkx5lmHY2z+77az/3lc371kL27XpD5T9f8Vr+PyLBY4fHmuHrpx8lRyl/HOgdB04t89/1O/w1cDnyilFU='
});


const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
client.connect();

var sql1 =
    "SELECT *,date_part('day',age(gettime, now())) diffdays " +
    ",(SELECT value FROM public.configure WHERE parameter = 'GetCoupon') msg " +
    "FROM public.getcoupon WHERE " +
    //"date_part('day', age(gettime, now())) > 0 and "+ //FOR 測試先MASK此行，不然可能沒資料
    "date_part('day', age(gettime, now())) / " +
    "(SELECT value:: integer FROM public.configure WHERE parameter = 'x') = 0 " +
    "; ";
console.log(sql1);

client.query(sql1, (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        
        bot.push(row.lineid, {
            type: 'text',
            text: row.msg + row.couponid
        });
        console.log('ok');
    }
    client.end();
});


