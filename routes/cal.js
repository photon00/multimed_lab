var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/JHCal';

var insertData = function(dbUrl, inputA, operator, inputB)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHCal');
        var timeStr = new Date().toLocaleString();
        var answer;
        if (isNaN(Number(inputA)) || isNaN(Number(inputB))) answer = 'err';
        else {
            if (operator == 1) { operator = '+'; answer = String(inputA+inputB);}
            else if (operator == 2) { operator = '-'; answer = String(inputA-inputB);}
            else if (operator == 3) { operator = '*'; answer = String(inputA*inputB);}
            else {operator = '/'; answer = String(inputA/inputB);}
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
        //operator  = req.body.txtContent;
        inputB = req.body.inputB;
        insertData(DB_CONN_STR, inputA, operator, inputB);
        selectData(DB_CONN_STR, function(result){
            res.render('cal', { title: 'Nmlab Calculator',
                                  users: result});
        });
});




module.exports = router;




