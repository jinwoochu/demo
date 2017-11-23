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

//유저 회원가입
exports.designRegister = function(req, res) {
    var designerEmail = req.body.designerEmail;
    var designName = req.body.designName;
    var description = req.body.description;
    var designerId;
    // 등록된 디자이너 email을 통해 있는 디자이너인지 확인한다.
    var selectQuery = "SELECT * FROM designer WHERE email=?";
    var selectQueryParams = [designerEmail];

    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "쿼리문 오류.", {});
            res.json(response);
            return;
        }
        if (result.length == 0) {
            response = makeResponse(0, "등록되지 않은 디자이너입니다.", {});
            res.json(response);
            return;
        } else {
            // 디자인 파일 등록
            designerId = result[0].id;
            console.log(designerId);
            var insertQuery = "INSERT INTO DESIGN () VALUES ()";
            var insertQueryParams = [];

            con.query(insertQuery, insertQueryParams, function(err2, result2, field2) {
                if (err2) {
                    response = makeResponse(0, "쿼리문 오류", {});
                    res.json(response);
                    return;
                } else {
                    var nowTime = new Date();


                    // db의 primary key와 블록체인의 identity를 맵핑시킨다. 
                    var DESIGN_ID = "DESIGN_" + result2.insertId;

                    //DB에 넣는걸 성공하면 블록체인에 데이터 저장한다.

                    var requestJsonData = {
                        "$class": "org.acme.ling.Design",
                        "DESIGN_ID": DESIGN_ID,
                        "designer_id": "DESIGNER_" + designerId,
                        "design_name": designName,
                        "description": description,
                        "register_time": nowTime.toJSON()
                    }

                    var options = {
                        url: REST_API_ADDRESS + 'Design',
                        method: 'POST',
                        json: requestJsonData
                    };

                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // 블록체인에도 데이터 넣기 성공하면 
                            response = makeResponse(1, "모든 로직이 정상처리 되었습니다.", {});
                            res.json(response);
                        } else console.log("DB에 데이터 넣기는 성공하였으나 블록체인에 접근실패")
                    });

                }
            });
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