var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/BoardDB3';

var FindNotNumIndex = function (str, index) {
    for (let i=index; i<str.length; i++) {
        if (isNaN(Number(str[i])) && str[i] != '.')
            return i;
    }
}
var ConstructNum = function (str) {
    let signIndex =  FindNotNumIndex(str, 0);
    let signIndex2;
    if (signIndex == 0) {
        if (str[signIndex] != '+' && str[signIndex] != '-') return 0;
        signIndex2 = FindNotNumIndex(str,1);
    }
    else  signIndex2 = signIndex;
    if (str[signIndex2]!='+' && str[signIndex2]!='-'){console.log(str[signIndex2]); return 0;}
    else {
        let lastletter = FindNotNumIndex(str,signIndex2+1);
        if (lastletter+1 != str.length || (str[lastletter]!='i' && str[lastletter] != 'j')) return 0;
        let num1 = Number(str.slice(0,signIndex2));
        let num2 = Number(str.slice(signIndex2,lastletter));
        if (isNaN(num1) || isNaN(num2)) return 0;
        else return [num1, num2];
        
    }
}

var insertData = function(dbUrl, mode, inputA, operator, inputB)
{
    MongoClient.connect(dbUrl, function(err, db){
        var collection = db.collection('JHCal');
        var timeStr = new Date().toLocaleString();
        var answer;
        switch(mode)
        {
            case "2":
                var A = ConstructNum(inputA);
                var B = ConstructNum(inputB);
                if (A == 0 || B == 0) answer = 'err';
                else {
                    let a = A[0];
                    let b = A[1];
                    let c = B[0];
                    let d = B[1];
                    if (operator == 1) { 
                        operator = '+';
                        if (b+d < 0) answer = String(a+c)+'-'+String(-b-d)+'i';
                        else answer = String(a+c)+'+'+String(b+d)+'i';
                    }
                    else if (operator == 2) { 
                        operator = '-';
                        if (b-d < 0) answer = String(a-c)+'-'+String(d-b)+'i';
                        else answer = String(a-c)+'+'+String(b=d)+'i';
                    }
                    else if (operator == 3) {
                        operator = '*';
                        let x = a*c-b*d;
                        let y = a*d+b*c;
                        if (y<0) answer = String(x)+'-'+String(-y)+'i';
                        else answer = String(x)+'+'+String(y)+'i';
                    }
                    else { 
                        operator = '/';
                        let det = c*c + d*d;
                        if (det == 0) answer = 'err';
                        else {
                            let x = (c*a+b*d)/det;
                            let y = (b*c-a*d)/det;
                            if (y<0) answer = String(x)+'-'+String(-y)+'i';
                            else answer = String(x)+'+'+String(y)+'i';
                        }
                    }
                } break;

                case "1":
                default:

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
                } break;
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
        mode = req.body.mode;
        inputA = req.body.inputA;
        operator = req.body.operator;
        inputB = req.body.inputB;
        console.log([mode,inputA,operator,inputB]);
        insertData(DB_CONN_STR, mode, inputA, operator, inputB);
        selectData(DB_CONN_STR, function(result){
            res.render('cal', { title: 'Nmlab Calculator',
                                  users: result});
        });
});




module.exports = router;





