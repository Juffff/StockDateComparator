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

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.get('/grandStock', (req, res) => {
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
            if(count>0){
                db.listItems({name: stockName}).then(data => db.updateItem(data[0]._id, layoutObjectsArray));
            }
        });

        res.send(layoutObjectsArray);

    });

});
app.listen(8070, () => {
    console.log(`Server is running on 8070`);
});
