//요청 페이지의 내용을 받아온다.
var request = require('request');


// mysql
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "ling"
});

var REST_API_ADDRESS = 'http://192.168.40.45:3000/api/';

// 주문 등록
exports.orderRegister = function(req, res) {

    var designId = parseInt(req.body.designId); // 직접입력방식x -> 사용자가 제품 클릭하면 디자인id값 반환하게 변경 필요
    var userId = req.body.userId; // 쿠키로 변경해야함.
    var expectedPrice = req.body.expectedPrice; // 이것도 직접입력방식x -> 사용자가 제품 클릭하면 해당값 반환하게 변경 필요
    var requestNQuestion = req.body.requestNQuestion;

    // 먼저 등록된 디자인 id를 검색해 있는 디자인인지 확인한다. 
    var selectQuery = "SELECT * FROM design WHERE id=?";
    var selectQueryParams = [designId];
    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "쿼리문 오류.", {});
            res.json(response);
            return;
        }
        if (result.length == 0) {
            response = makeResponse(0, "등록되지 않은 디자인입니다.", {});
            res.json(response);
            return;
        } else {
            // 등록된 디자인이면 주문을 넣어야겠지?
            // 주문 등록
            var insertQuery = "INSERT INTO `ORDER` () VALUES ()";
            var insertQueryParams = [];

            con.query(insertQuery, insertQueryParams, function(err2, result2, field2) {
                if (err2) {
                    response = makeResponse(0, "주문등록 쿼리문 오류", {});
                    res.json(response);
                    return;
                } else {

                    var nowTime = (new Date()).toJSON();


                    // db의 primary key와 블록체인의 identity를 맵핑시킨다. 
                    var ORDER_ID = "ORDER_" + result2.insertId;
                    var DESIGN_ID = "DESIGN_" + designId;
                    var USER_ID = "USER_" + userId;
                    // //DB에 넣는걸 성공하면 블록체인에 데이터 저장한다.

                    var requestJsonData = {
                        "$class": "org.acme.ling.Order",
                        "ORDER_ID": ORDER_ID,
                        "design_id": "resource:org.acme.ling.Design#" + DESIGN_ID,
                        "user_id": "resource:org.acme.ling.User#" + USER_ID,
                        "order_time": nowTime,
                        "expected_price": expectedPrice,
                        "request_question": requestNQuestion,
                        "order_state": "APPLYING_ORDER" // 주문 등록하면 당연히 첫 단계는 주문 접수 단계
                    }

                    var options = {
                        url: REST_API_ADDRESS + 'Order',
                        method: 'POST',
                        json: requestJsonData
                    };

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // 블록체인에도 데이터 넣기 성공하면 
                            response = makeResponse(1, "모든 로직이 정상처리 되었습니다.", {});
                            res.json(response);
                        } else {
                            response = makeResponse(0, "블록체인에 접근 실패", {});
                            res.json(response);
                        }
                    });

                }
            });
        }
    });
}

// 들어온 주문(제품)을 만들 공장(주인) 선택
exports.changeFactoryOwner = function(req, res) {
    var orderId = "ORDER_" + req.body.orderId;
    var factoryOwnerId = "FACTORY_OWNER_" + req.body.factoryOwnerId;
    var nowTime = (new Date()).toJSON();
    // 바로 블록체인 데이터를 변경한다. (트랜잭션API 호출)
    var requestJsonData = {
        "$class": "org.acme.ling.ChangeFactoryOwner",
        "order": orderId,
        "factory_owner": factoryOwnerId,
        "transactionId": "",
        "timestamp": nowTime
    }

    var options = {
        url: REST_API_ADDRESS + 'ChangeFactoryOwner',
        method: 'POST',
        json: requestJsonData
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // 블록체인에도 데이터 넣기 성공하면 
            response = makeResponse(1, "모든 로직이 정상처리 되었습니다.", {});
            res.json(response);
        } else {
            response = makeResponse(0, "블록체인에 접근 실패", {});
            res.json(response);
        }
    });
}


// 사용자가 넣은 주문의 최종가격 선정
exports.changeFinalPrice = function(req, res) {
    var orderId = "ORDER_" + req.body.orderId;
    var finalPrice = req.body.finalPrice;
    var nowTime = (new Date()).toJSON();
    // 바로 블록체인 데이터를 변경한다. (트랜잭션API 호출)
    var requestJsonData = {
        "$class": "org.acme.ling.ChangeFinalPrice",
        "order": orderId,
        "final_price": finalPrice,
        "transactionId": "",
        "timestamp": nowTime
    }

    var options = {
        url: REST_API_ADDRESS + 'ChangeFinalPrice',
        method: 'POST',
        json: requestJsonData
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // 블록체인에도 데이터 넣기 성공하면 
            response = makeResponse(1, "모든 로직이 정상처리 되었습니다.", {});
            res.json(response);
        } else {
            response = makeResponse(0, "블록체인에 접근 실패", {});
            res.json(response);
        }
    });
}



// 주문 상태 변경
exports.changeOrderState = function(req, res) {
    var orderId = "ORDER_" + req.body.orderId;
    var state = req.body.state;
    var nowTime = (new Date()).toJSON();
    // 바로 블록체인 데이터를 변경한다. (트랜잭션API 호출)
    var requestJsonData = {
        "$class": "org.acme.ling.ChangeOrderState",
        "order": orderId,
        "state": state,
        "transactionId": "",
        "timestamp": nowTime
    }

    var options = {
        url: REST_API_ADDRESS + 'ChangeOrderState',
        method: 'POST',
        json: requestJsonData
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // 블록체인에도 데이터 넣기 성공하면 
            response = makeResponse(1, "모든 로직이 정상처리 되었습니다.", {});
            res.json(response);
        } else {
            response = makeResponse(0, "블록체인에 접근 실패", {});
            res.json(response);
        }
    });
}








// 리스폰스 만드는 함수
function makeResponse(status, message, data) {
    var response = {
        status: status,
        message: message
    };

    for (var key in data) {
        response[key] = data[key];
    }
    return response;
}