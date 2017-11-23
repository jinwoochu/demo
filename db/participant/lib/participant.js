// crypto!!
const crypto = require('crypto');

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
exports.userRegister = function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);
    var phone = req.body.phone;
    var address = req.body.address;

    var selectQuery = "SELECT * FROM USER WHERE email=?";
    var selectQueryParams = [email];

    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "회원가입에 실패했습니다1.", {});
            res.json(response);
            return;
        }

        if (result.length != 0) {
            response = makeResponse(0, "이미 등록된 아이디입니다.", {});
            res.json(response);
            return;
        } else {
            var insertQuery = "INSERT INTO USER (email, password) VALUES (?,?)";
            var insertQueryParams = [email, password];

            con.query(insertQuery, insertQueryParams, function(err2, result2, field2) {
                if (err2) {
                    response = makeResponse(0, "회원가입에 실패했습니다2.", {});
                    res.json(response);
                    return;
                }

                // db의 primary key와 블록체인의 identity를 맵핑시킨다. 
                var USER_ID = "USER_" + result2.insertId;

                //DB에 넣는걸 성공하면 블록체인에 데이터 저장한다.
                var requestJsonData = {
                    "$class": "org.acme.ling.User",
                    "ID": USER_ID,
                    "email": email,
                    "name": name,
                    "phone": phone,
                    "address": address
                }

                var options = {
                    url: REST_API_ADDRESS + 'User',
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

            });

        }
    });
}


//디자이너 회원가입
exports.designerRegister = function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);
    var phone = req.body.phone;
    var address = req.body.address;

    var selectQuery = "SELECT * FROM DESIGNER WHERE email=?";
    var selectQueryParams = [email];

    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "회원가입에 실패했습니다1.", {});
            res.json(response);
            return;
        }

        if (result.length != 0) {
            response = makeResponse(0, "이미 등록된 아이디입니다.", {});
            res.json(response);
            return;
        } else {
            var insertQuery = "INSERT INTO DESIGNER (email, password) VALUES (?,?)";
            var insertQueryParams = [email, password];

            con.query(insertQuery, insertQueryParams, function(err2, result2, field2) {
                if (err2) {
                    response = makeResponse(0, "회원가입에 실패했습니다2.", {});
                    res.json(response);
                    return;
                }

                // db의 primary key와 블록체인의 identity를 맵핑시킨다. 
                var DESIGNER_ID = "DESIGNER_" + result2.insertId;

                //DB에 넣는걸 성공하면 블록체인에 데이터 저장한다.
                var requestJsonData = {
                    "$class": "org.acme.ling.Designer",
                    "ID": DESIGNER_ID,
                    "email": email,
                    "name": name,
                    "phone": phone,
                    "address": address
                }

                var options = {
                    url: REST_API_ADDRESS + 'Designer',
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


            });

        }
    });
}


//공장주인 회원가입
exports.factoryOwnerRegister = function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);
    var phone = req.body.phone;
    var address = req.body.address;

    var selectQuery = "SELECT * FROM FACTORY_OWNER WHERE email=?";
    var selectQueryParams = [email];

    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "회원가입에 실패했습니다1.", {});
            res.json(response);
            return;
        }

        if (result.length != 0) {
            response = makeResponse(0, "이미 등록된 아이디입니다.", {});
            res.json(response);
            return;
        } else {
            var insertQuery = "INSERT INTO FACTORY_OWNER (email, password) VALUES (?,?)";
            var insertQueryParams = [email, password];

            con.query(insertQuery, insertQueryParams, function(err2, result2, field2) {
                if (err2) {
                    response = makeResponse(0, "회원가입에 실패했습니다2.", {});
                    res.json(response);
                    return;
                }

                // db의 primary key와 블록체인의 identity를 맵핑시킨다. 
                var FACTORY_OWNER_ID = "FACTORY_OWNER_" + result2.insertId;

                //DB에 넣는걸 성공하면 블록체인에 데이터 저장한다.
                var requestJsonData = {
                    "$class": "org.acme.ling.FactoryOwner",
                    "ID": FACTORY_OWNER_ID,
                    "email": email,
                    "name": name,
                    "phone": phone,
                    "address": address
                }
                var options = {
                    url: REST_API_ADDRESS + 'FactoryOwner',
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


            });

        }
    });
}


// 유저 로그인
exports.userLogin = function(req, res) {
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);
    var selectQuery = "SELECT * FROM USER WHERE email=?";
    var selectQueryParams = [email];

    // email이 먼저 있는지 확인한다.
    con.query(selectQuery, selectQueryParams, function(err, result, field) {
        if (err) {
            response = makeResponse(0, "잘못된 쿼리문입니다.", {});
            res.json(response);
            return;
        }
        if (result.length == '0') {
            response = makeResponse(0, "없는 아이디 입니다.", {});
            res.json(response);
            return;
        } else if (result.length == 1) {
            if (result[0].password === password) {
                response = makeResponse(1, "로그인 성공", {});
                res.json(response);
                return;
            } else {
                response = makeResponse(0, "비밀번호가 틀렸습니다.", {});
                res.json(response);
                return;
            }
        }

    });

}

// 디자이너 로그인
exports.designerLogin = function(req, res) {
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);
}

// 공장주인 로그인
exports.factoryOwnerLogin = function(req, res) {
    var email = req.body.email;
    var password = getSecretPassword(req.body.password);

}


//패스워드 암호화 함수
function getSecretPassword(password) {
    var cipher = crypto.createCipher('aes-256-cbc', '열쇠');
    var secretPassword = cipher.update(password, 'utf8', 'base64');
    return secretPassword + cipher.final('base64');
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

// 랜덤 함수(정수)
function makeRandom(min, max) {
    var RandVal = Math.random() * (max - min) + min;
    return Math.floor(RandVal);
}