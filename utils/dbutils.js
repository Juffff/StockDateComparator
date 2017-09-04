import mongoose from 'mongoose';
import '../models/Stock';
import '../models/Differents';
import {db} from '../config/config.json';


const Stock = mongoose.model('Stock');
const Difference = mongoose.model('Differents');

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

export function findOneItem(stock) {
    return Stock.find(stock);
}

export function updateItem(id, data) {
    Stock.findById(id, function (err, stock) {
        if (err) return console.log(err);
        let arr = [];
        arr = arr.concat(stock.data);
        arr = arr.concat({
            date: Date.now(),
            items: data

        });
        stock.data = arr;
        stock.save();
    });
}

function sortInAPeriod(el1, el2) {
    return el1.link > el2.link;
}

export function detailCompareItems(prev, next) {
    const prevLinkArray = prev.sort(sortInAPeriod).map(el => el.link);
    const nextLinkArray = next.sort(sortInAPeriod).map(el => el.link);
    let added = [];
    let removed = [];

    next.forEach(el => {
        if (prevLinkArray.indexOf(el.link) < 0)  added.push(el);
    });
    prev.forEach(el => {
        if (nextLinkArray.indexOf(el.link) < 0) return removed.push(el);
    });

    return {
        added: added,
        removed: removed
    };
}

export function createDifference(data) {
    const difference = new Difference({
        name: data.name,
        date: Date.now(),
        added: data.added,
        removed: data.removed
    });

    return difference.save();
}

export function listDifferents() {
    return Difference.find();
}