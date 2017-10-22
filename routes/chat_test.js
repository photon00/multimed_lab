var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/BoardDB3';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = app.Router();


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('GIVE_USER_ID', function(userID) {
    console.log(userID);
  });
});


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
        selectData(DB_CONN_STR, function(result){
            res.render('board', { title: 'Nmlab Board',
                                  users: result});
        });
});

module.exports = router;





