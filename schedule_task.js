console.log('=====排程啟動=====1');
console.log(Date.now());
const { Client } = require('pg');

    
//排程啟動
var linebot = require('linebot');

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
    //領取優惠卷
    "SELECT lineid, date_part('day',age(gettime, now())) diffdays " +
    ",(SELECT value FROM public.configure WHERE parameter = 'GetCoupon')||couponid msg FROM public.getcoupon WHERE " +
    "date_part('day', age(gettime, now())) = (SELECT value:: integer FROM public.configure WHERE parameter = 'x') " +
    //使用優惠卷
    "union SELECT lineid, date_part('day',age(usetime, now())) diffdays " +
    ",(SELECT value FROM public.configure WHERE parameter = 'UseCoupon')||couponid msg FROM public.usecoupon WHERE " +
    "date_part('day', age(usetime, now())) = (SELECT value:: integer FROM public.configure WHERE parameter = 'x') " +
    //加入
    "union SELECT id lineid, date_part('day',age(addtime, now())) diffdays " +
    ",(SELECT value FROM public.configure WHERE parameter = 'AddLine') msg FROM public.addline WHERE " +
    "date_part('day', age(addtime, now())) = (SELECT value:: integer FROM public.configure WHERE parameter = 'x') " +
    //使用優惠卷
    "union SELECT lineid, date_part('day',age(clicktime, now())) diffdays " +
    ",(SELECT value FROM public.configure WHERE parameter = 'ClickURL')||url msg FROM public.clickurl WHERE " +
    "date_part('day', age(clicktime, now())) = (SELECT value:: integer FROM public.configure WHERE parameter = 'x') " +
    "; ";
console.log(sql1);

client.query(sql1, (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        
        bot.push(row.lineid, {
            type: 'text',
            text: row.msg 
        });
        console.log('push ok==>' + row.lineid +' '+ row.msg);
    }
    client.end();
});


