/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let likes;

  suite("GET /api/stock-prices => stockData object", function() {
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.isDefined(res.body.stockData);
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "GOOG");
          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "msft", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isDefined(res.body.stockData);
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "MSFT");
          assert.isAbove(res.body.stockData.likes, 0);
          likes = res.body.stockData.likes;
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "msft", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isDefined(res.body.stockData);
          assert.property(res.body.stockData, "stock");
          assert.property(res.body.stockData, "price");
          assert.property(res.body.stockData, "likes");
          assert.equal(res.body.stockData.stock, "MSFT");
          assert.equal(res.body.stockData.likes, likes);
          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], "stock");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "stock");
          assert.property(res.body.stockData[1], "price");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.oneOf(res.body.stockData[0].stock, ["GOOG", "MSFT"]);
          assert.oneOf(res.body.stockData[1].stock, ["GOOG", "MSFT"]);
          assert.notEqual(
            res.body.stockData[0].stock,
            res.body.stockData[1].stock
          );
          assert.notEqual(
            res.body.stockData[0].price,
            res.body.stockData[1].price
          );
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], "stock");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "stock");
          assert.property(res.body.stockData[1], "price");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.oneOf(res.body.stockData[0].stock, ["GOOG", "MSFT"]);
          assert.oneOf(res.body.stockData[1].stock, ["GOOG", "MSFT"]);
          assert.notEqual(
            res.body.stockData[0].stock,
            res.body.stockData[1].stock
          );
          assert.notEqual(
            res.body.stockData[0].price,
            res.body.stockData[1].price
          );
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          done();
        });
    });
  });
});