var linebot = require('linebot');
var express = require('express');


var bot = linebot({
    channelId: '1585073032',
    channelSecret: 'e0acb451ddc1d0b89f5e051f78f52739', 
    channelAccessToken: 'llr0iuNKZNnNvDXKQ5SpBGUVSCGM1FxOwEWKFAbiX45ZbKYZVzbLt67TcDwhgjISuTvIdMstBWVpfADfORx7cT0/97Tkx5lmHY2z+77az/3lc371kL27XpD5T9f8Vr+PyLBY4fHmuHrpx8lRyl/HOgdB04t89/1O/w1cDnyilFU='
});

console.log('start');




//訊息事件
bot.on('message', function (event) {
    console.log('==================message-訊息事件');
    console.log('解析收到的event:');
    console.log('type==>', event.type);
    console.log('replyToken==>', event.replyToken);
    console.log('userId==>', event.source.userId);
    console.log('==================');
    if (event.message.text == '0') {
        event.reply({
                                    "type": "template",
                            "altText": "this is a carousel template",
                            "template": {
                                "type": "carousel",
                                "columns": [
                                {
				"thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                                "imageBackgroundColor": "#000000",	
                                    "title": "限時優惠",
                                    "text": "快連結到人工智慧網站",
                                    "defaultAction": [{
                                       /* "type": "uri",
                                        "label": "View detail",
                                        "uri": "http://example.com/page/123"*/
				          type: 'message',
                			  label: '我要連結人工智慧測試網站',
                			  text: 'https://aity.waca.ec/'
                                    },{
				     
      				          type: 'message',
                			  label: '我要連結人工智慧測試網站',
                			  text: 'https://aity.waca.ec/'
                                    
				    }
						      
				    ]
                                    "actions": [
                                    {
      				          type: 'message',
                			  label: '我要連結人工智慧測試網站',
                			  text: 'https://aity.waca.ec/'
                                    }/*,
                                    {
                                        "type": "uri",
                                        "label": "分享",
                                        "uri": "https://aity.waca.ec/"
                                    }*/
                                ]
                              }                  ],
                          "imageAspectRatio": "rectangle",
                          "imageSize": "cover"
			    }
				    });
            /*type: 'template',
        altText: 'this is a confirm template',
        template: {
            type: 'confirm',
            text: '連結人工智慧測試網站?',
            actions: [{
                type: 'message',
                label: '我要連結人工智慧測試網站',
                text: 'https://aity.waca.ec/'
                }]
            }//End of template
        });//End of event.reply
        */
        /*
        event.reply({
        type: 'template',
        altText: 'this is a confirm template',
        template: {
            type: 'confirm',
            text: '連結人工智慧測試網站?',
            actions: [{
                type: 'message',
                label: '我要連結人工智慧測試網站',
                text: 'https://aity.waca.ec/'
                }, {
                    type: 'message',
                    label: 'No',
                    text: 'no'
                }]
            }//End of template
        });//End of event.reply
        */
    }
});


const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("網路已啟動==>", port);
});
