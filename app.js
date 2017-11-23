// fileSystem
var fs = require('fs');

// participant DB모듈  
var participantDB = require('./db/participant');
// design DB모듈  
var designDB = require('./db/design');
// order DB모듈  
var orderDB = require('./db/order');
// payment DB모듈  
var paymentDB = require('./db/payment');





// express
var express = require('express'),
    path = require("path"),
    app = express(),
    fileUpload = require('express-fileupload');

//파일 업로더
app.use(fileUpload());

//static폴더
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static('js/lib'));

//ejs 렌더링
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

var cookie = require('cookie-parser');
app.use(cookie('!@#%%@#@'));


app.get('/insu', function(req, res) {
    res.render('insu.html');

});



//첫 화면
app.get('/', function(req, res) {
    res.render('index.html');
});

// 유저 회원가입
app.post("/userRegister", function(req, res) {
    participantDB.userRegister(req, res);
});

// 디자이너 회원가입
app.post("/designerRegister", function(req, res) {
    participantDB.designerRegister(req, res);
});

// 공장주인 회원가입
app.post("/factoryOwnerRegister", function(req, res) {
    participantDB.factoryOwnerRegister(req, res);
});


// 유저, 디자이너, 공장주인 로그인하기 
app.post('/login', function(req, res) {
    var checkedType = req.body.checkAtt;

    if (checkedType == 'user') participantDB.userLogin(req, res);
    else if (checkedType == 'designer') participantDB.designerLogin(req, res);
    else participantDB.factoryOwnerLogin(req, res);
});

// 디자인 등록
app.post('/designRegister', function(req, res) {
    designDB.designRegister(req, res);
})


// 주문 등록
app.post('/orderRegister', function(req, res) {
    orderDB.orderRegister(req, res);
})

// 주문 관련(공장 선택) 
app.post('/changeFactoryOwner', function(req, res) {
    orderDB.changeFactoryOwner(req, res);
})


// 최종 가격 선정
app.post('/changeFinalPrice', function(req, res) {
    orderDB.changeFinalPrice(req, res);
})


// 주문 상태 변경
app.post('/changeOrderState', function(req, res) {
    orderDB.changeOrderState(req, res);
})

// 결제서 등록
app.post('/paymentRegister', function(req, res) {
    paymentDB.paymentRegister(req, res);
})




app.listen(3000, function() {
    console.log("Server listening on http://localhost:3000");
});