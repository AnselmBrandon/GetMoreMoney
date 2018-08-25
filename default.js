var linebot = require('linebot');
var express = require('express');


var bot = linebot({
    channelId: '1585073032',
    channelSecret: 'e0acb451ddc1d0b89f5e051f78f52739', 
    channelAccessToken: 'llr0iuNKZNnNvDXKQ5SpBGUVSCGM1FxOwEWKFAbiX45ZbKYZVzbLt67TcDwhgjISuTvIdMstBWVpfADfORx7cT0/97Tkx5lmHY2z+77az/3lc371kL27XpD5T9f8Vr+PyLBY4fHmuHrpx8lRyl/HOgdB04t89/1O/w1cDnyilFU='
});

//heroku-postgresql
const { Client } = require('pg');

console.log('網站啟動中…');

//使用者加入機器人好友事件
bot.on('follow', function (event) {
    console.log('==================follow-使用者加入機器人好友事件');
    const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: true, });
    client.connect();
    client.query("SELECT count(*) FROM public.addline where ID='" + event.source.userId + "';", (err, res) => {        
        if (err) throw err;
        for (let row of res.rows) {
            var bExist = row.count;
            console.log("回傳資料:" + row.user_id);
            console.log(JSON.stringify(row));
            if (bExist === "0") {
                console.log("新用戶，新增一筆資料");

                const client1 = new Client({ connectionString: process.env.DATABASE_URL, ssl: true, });
                client1.connect();
                client1.query(
                    'INSERT into public.addline (id, addtime) VALUES($1, $2) ',
                    [event.source.userId, new Date()],
                    function (err1, result) {
                        if (err1) throw err1;
                        client1.end();
                    });
                console.log("新增一筆用戶資料OK");
            }
        }
        client.end();
    });
});

//使用者刪除機器人好友事件
bot.on('unfollow', function (event) {
    console.log('==================unfollow-使用者刪除機器人好友事件');
});



//訊息事件
bot.on('message', function (event) {
    console.log('==================message-訊息事件');
    console.log('解析收到的event:');
    console.log('type==>', event.type);
    console.log('replyToken==>', event.replyToken);
    console.log('userId==>', event.source.userId);
    console.log('==================');
    if (event.message.text === 'url') {
        event.reply({
        type: 'template',
        altText: 'this is a confirm template',
        template: {
            type: 'confirm',
            text: '連結人工智慧測試網站?',
            actions: [{
                type: 'message',
                label: '我要連結',
                text: '我要連結'
                }, {
                    type: 'message',
                    label: '我不要連結',
                    text: '我不要連結'
                }]
            }//End of template
        });//End of event.reply
    }
     if (event.message.text === '我要連結') {
        event.reply({
        type: 'text',
        text: 'https://aity.waca.ec/'
        });//End of event.reply
    }
    
    
    
    
 /*    if (event.message.text == 'coupon') {
        event.reply({
        type: 'template',
        altText: '優惠券',
        template: {
            type: 'confirm',
            text: '有效期限',
            actions: [{
                type: 'message',
                label: '領取優惠券',
                text: '領取優惠券'
                }, {
                    type: 'message',
                    label: '我不要優惠券',
                    text: '我不要優惠券'
                }]
            }//End of template
        });//End of event.reply
    }*/
    
    
    if (event.message.text === 'coupon') {
        event.reply({
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                    {
                        "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                        "imageBackgroundColor": "#000000",
                        "title": "優惠券",
                        "text": "有效期限  2018-08-10~2018-08-17",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/222"
                        },
                        "actions": [
                            {
                                "type": "message",
                                "label": "領取",
                                "text": "領取"
                            }/*,
                                    {
                                        "type": "postback",
                                        "label": "Add to cart",
                                        "data": "action=add&itemid=111"
                                    }*/
                        ]
                    }
                ],
                "imageAspectRatio": "rectangle",
                "imageSize": "cover"
            }
        });
    }
    
    if (event.message.text.startsWith('領取')) {

        console.log('==================事件:領取優惠卷==' + event.message.text);
        var cpid = event.message.text.replace('領取', '');
        const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: true, });
        client.connect();
        client.query(
            'INSERT into public.getcoupon (lineid, gettime, couponid) VALUES($1, $2, $3) ',
            [event.source.userId, new Date(), cpid],
            function (err1, result) {
                if (err1) throw err1;
                client.end();
            });
        console.log("新增一筆【領取優惠卷】" + cpid +"資料OK");

        event.reply({
            "type": "template",
            "altText": "this is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                    {
                        "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                        "imageBackgroundColor": "#000000",
                        "title": "優惠券",
                        "text": "有效期限  2018-08-10~2018-08-17",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/222"
                        },
                        "actions": [
                            {
                                "type": "message",
                                "label": "使用",
                                "text": "使用"
                            }/*,
                                    {
                                        "type": "postback",
                                        "label": "Add to cart",
                                        "data": "action=add&itemid=111"
                                    }*/
                        ]
                    }
                ],
                "imageAspectRatio": "rectangle",
                "imageSize": "cover"
            }
        });
    }
});





const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("網站已啟動==>", port);
});
