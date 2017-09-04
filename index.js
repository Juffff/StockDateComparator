import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import got from 'got';
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import replaceAll from 'replaceall';
import * as db from './utils/dbutils';

db.connect();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

setInterval(() => {
    console.log('dildo');
    const stockName = 'GrandStock';
    got(`https://grand-stock.com.ua/ua/katalog-tovarov?limit=100`).then(data => {

        const dom = new JSDOM(data.body);
        const layout = dom.window.document.getElementById("product-layout").getElementsByClassName('product_grid');
        const layoutObjectsArray = Object.values(layout).map(el => {
            let name = '';

            const nameContent = el
                .getElementsByClassName('bl-brand-img')[0]
                .getElementsByTagName('span')[0]
                .getAttribute('class');

            if (nameContent === 'br-img') {
                name =
                    el
                        .getElementsByClassName('bl-brand-img')[0]
                        .getElementsByTagName('span')[0].getElementsByTagName('img')[0].getAttribute('alt');
            }
            if (nameContent === 'br-txt') {
                name =
                    el
                        .getElementsByClassName('bl-brand-img')[0]
                        .getElementsByTagName('span')[0].innerHTML;
            }

            const link = el
                .getElementsByClassName('product-media')[0]
                .getElementsByClassName('product-thumbnail')[0]
                .getElementsByTagName('div')[0]
                .getElementsByTagName('a')[0].getAttribute('href');

            const title = el
                .getElementsByClassName('product-media')[0]
                .getElementsByClassName('product-thumbnail')[0]
                .getElementsByTagName('div')[0]
                .getElementsByTagName('img')[0].getAttribute('alt');

            const img = el
                .getElementsByClassName('product-media')[0]
                .getElementsByClassName('product-thumbnail')[0]
                .getElementsByTagName('div')[0]
                .getElementsByTagName('img')[0].getAttribute('src');

            let price = el
                .getElementsByClassName('product-body')[0]
                .getElementsByClassName('product-price')[0];

            if (!price) {
                price = '';
            } else
                price = replaceAll(`<span class=\"curr-euro\"></span>`, '€', price.getElementsByClassName("amount")[0].innerHTML.toString());
            price = replaceAll(`"`, '', price);

            return {
                name: name,
                link: link,
                image: img,
                title: title.toUpperCase(),
                price: price
            };
        });

        db.listItems({name: stockName}).count((err, count) => {
            if (count === 0) {
                db.createItem({
                    name: stockName,
                    data: [{
                        date: Date.now(),
                        items: layoutObjectsArray
                    }]
                })
            }
            if (count > 0) {
                db.listItems({name: stockName}).then(data => db.updateItem(data[0]._id, layoutObjectsArray));
            }
        });

        db.findOneItem(stockName)
            .then(stocks => stocks[0])
            .then(stock => stock.data)
            .then(data => {
                const compareResult = db.detailCompareItems(data[data.length - 1].items, layoutObjectsArray);
                const added = compareResult.added;
                const removed = compareResult.removed;
                if(added.length !== 0 || removed.length !== 0){
                    db.createDifference({
                        name: stockName,
                        data: Date.now(),
                        added: added,
                        removed: removed
                    })
                }

            });
        ;


    });
}, 20000);
const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.get('/grandStock', (req, res) => {
    db.listDifferents().then(
        data => {
            res.send(
               data.map(el => {
                 console.log(el.name);
                   return(
                       `${el.date} - ${el.name} - ${el.removed} - ${el.added}`
                   );
               })
            );
        }
    );
});
app.listen(8070, () => {
    console.log(`Server is running on 8070`);
});
