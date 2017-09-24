var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/JHBoard';

var insertData = function(dbUrl, username, content)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHBoard');
        var timeStr = new Date().toLocaleString();
        var data = [{'username':username,
                     'content':content,
                     'time':timeStr}];
        console.log('Insert user: ' + username);
        collection.insert(data);
        db.close()
    });
}

var selectData = function(dbUrl, callback)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHBoard');
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
        res.render('board', { title: 'Nmlab Board',
                              users: result});
        });
});

/* POST insert data. */
router.post('/', function(req, res) {
        username = req.body.txtUserName;
        content  = req.body.txtContent;
        insertData(DB_CONN_STR, username, content);
        selectData(DB_CONN_STR, function(result){
            res.render('board', { title: 'Nmlab Board',
                                  users: result});
        });
});




module.exports = router;





