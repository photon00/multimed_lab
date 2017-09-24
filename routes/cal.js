var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/BoardDB3';

var insertData = function(dbUrl, inputA, operator, inputB)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHCal');
        var timeStr = new Date().toLocaleString();
        var answer;
        if (isNaN(Number(inputA)) || isNaN(Number(inputB))) answer = 'err';
        else {
            var a = Number(inputA);
            var b = Number(inputB);
            if (operator == 1) { operator = '+'; answer = String(a+b);}
            else if (operator == 2) { operator = '-'; answer = String(a-b);}
            else if (operator == 3) { operator = '*'; answer = String(a*b);}
            else { 
                operator = '/';
                if (b != 0) answer = String(a/b);
                else answer = 'err';
            }
        }   
        var data = [{'A':inputA,
                     'operator':operator,
                     'B':inputB,
                     'answer':answer,
                     'time':timeStr}];
        console.log('Insert Data: ' + inputA + operator + inputB + '=' + answer);
        collection.insert(data);
        db.close()
    });
}

var selectData = function(dbUrl, callback)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHCal');
        collection.find({}).toArray(function(err, result){
            if (err) throw err;
                callback(result);
                db.close();
        });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    selectData(DB_CONN_STR, function(result){
        res.render('cal', { title: 'Nmlab Calculator',
                              users: result});
        });
});

/* POST insert data. */
router.post('/', function(req, res) {
        inputA = req.body.inputA;
        operator = req.body.operator;
        inputB = req.body.inputB;
        insertData(DB_CONN_STR, inputA, operator, inputB);
        selectData(DB_CONN_STR, function(result){
            res.render('cal', { title: 'Nmlab Calculator',
                                  users: result});
        });
});




module.exports = router;





