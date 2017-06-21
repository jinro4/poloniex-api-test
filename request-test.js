let _ = require('lodash'),
    request = require('request');

let url = 'https://poloniex.com/public';

let times = 0;

let amount = [];

setInterval(() => {
    let end = new Date().getTime() / 1000,
        start = end - 180;

    request.get({
        url: url,
        qs: {
            command: 'returnTradeHistory',
            currencyPair: 'BTC_XRP',
            start: Math.round(start),
            end: Math.round(end)
        },
        json: true
    }, function(err, response, body) {
        let buy = sell = 0;

        _.each(body, v => {
            if (v.type === 'buy') {
                buy += (+v.amount);

                return;
            }

            sell += (+v.amount);
        });

        times++;
        amount.push(buy - sell);

        console.log('::CURRENT STATUS:', buy - sell, '::');

        if (times > 4) {
            let p, n = 0;

            _.each(amount, (v) => {
                if (v > 0) {
                    p++;
                } else {
                    n++;
                }
            });

            console.log('---------------------------')
            console.log(new Date());

            if (p > n) {
                console.log(':: BUY THIS ::');
            } else {
                console.log(':: SELL THIS ::');
            }
            console.log('---------------------------')

            times = 0;
        }
    });
}, 60000);
