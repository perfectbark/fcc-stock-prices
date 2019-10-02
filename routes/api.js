/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const axios = require('axios');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
let client, db;

(async function(){
  try {
    client = new MongoClient(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('fcc');
  } catch(err) {
    console.error('connection error', err);
  }
})();

async function getStockData(stockSymbol, like=null) {
  try {
    let stock = stockSymbol.toUpperCase();
    let r = await axios.get('https://cloud.iexapis.com/stable/stock/'+stock+'/quote?token='+process.env.APIKEY);
    let d = await db.collection("stocks").findOne({"stock": stock});
    if (like) {
      if (d) {
        if (!d.likes.includes(like))
          d = await db.collection('stocks').findOneAndUpdate({'stock': stock}, {"$push": {'likes': like}});
      } else {
        d = await db.collection('stocks').insertOne({'stock': stock, 'likes': [like]});
      }
    } else {
      if (!d)
        d = {"stock": stock, "likes": []};
    }
    return {"stock": stock, "price": r.data.latestPrice, "likes": d.likes.length};
  } catch (err) {
    if (err.isAxiosError)
      console.error('stock not exists');
    return null;
  }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      if (!Array.isArray(req.query.stock)) {
        let d = await getStockData(req.query.stock, req.query.like);
         if (d)
            return res.json( {"stockData": d});
      } else {
        let d0 = await getStockData(req.query.stock[0], req.query.like);
        let d1 = await getStockData(req.query.stock[1], req.query.like);
        if (d0 && d1)
          return res.json({"stockData": [{"stock": d0.stock, "price": d0.price, "rel_likes": d0.likes - d1.likes}, {"stock": d1.stock, "price": d1.price, "rel_likes": d1.likes - d0.likes}]});
      }
    });
    
};
