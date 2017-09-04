import mongoose from 'mongoose';
import '../models/Stock';
import {db} from '../config/config.json';


const Stock = mongoose.model('Stock');

export function connect() {
    mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`);
}

export function createItem(data) {
    const stock = new Stock({
        name: data.name,
        data: data.data
    });

    return stock.save();
}


export function listItems(stock) {
    return Stock.find(stock);
}


export function updateItem(id, data) {
    Stock.findById(id, function (err, stock) {
        if (err) return console.log(err);
        let arr = [];
        arr = arr.concat(stock.data);
        arr = arr.concat({
            date: Date.now(),
            data:data

        });
        stock.data = arr;
        stock.save();
    });
}
