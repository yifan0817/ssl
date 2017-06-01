var fs = require("fs");
var insertData = function(data, res, path, newpath) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('account');

            //重复检测
            collection.find({
                username: data.username
            }).toArray(function(err, result) {
                if (result.length != 0) { //检测到重复用户名
                    reject({
                        success: false,
                        info: 'repetitive'
                    })
                    console.log('检测到重复用户名');
                    db.close();
                } else {
                    console.log('未检测到重复用户名');
                    collection.insert(data, function(err, result) {
                        if (err) {
                            console.log('Error:' + err);
                            reject({
                                success: false,
                                info: 'insert'
                            })
                        }
                        //console.log(result);
                        db.close();
                        resolve({
                            success: true
                        });
                    });
                }
            });
        });
    });
    promise.then(function(value) {
        console.log(newpath);
        fs.renameSync(path, newpath); //重命名
        console.log('添加用户成功');
        res.json({
            success: true
        })
    }, function(value) {
        console.log('添加用户错误');
        res.json(value)
    })
}

var getAllUsers = function(res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('account');
            collection.find({}).toArray(function(err, result) {
                if (err || !result.length) {
                    console.log('Error:' + err);
                    reject(err)
                }
                db.close();
                resolve(result)
            });
        });
    });
    promise.then(function(value) {
        res.json({
            success: true,
            userData: value
        })
    }, function() {
        res.json({
            success: false
        })
    })
}

var loginstat = require('./loginstat.js');
var selectData = function(search, res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('account');
            collection.find({
                username: search.username
            }).toArray(function(err, result) {
                if (err || !result.length) {
                    console.log('Error:' + err);
                    reject(err)
                }
                // console.log(result);//在这里可以正常获取
                db.close();
                resolve(result)
            });
        });
    });
    promise.then(function(value) {
        if (value[0].passwd == search.passwd) {
            var sessionid = (Math.random() + '').slice(2)
            loginstat.insertData({
                createdAt: new Date(),
                sessionid: sessionid //openid+session_key
            })
            res.json({
                success: true,
                userData: value,
                sessionid: sessionid
            })
        } else {
            res.json({
                success: false
            })
        }
    }, function() {
        res.json({
            success: false
        })
    })
}

var updateData = function(data, res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('messages');
            //更新数据
            var whereStr = {
                "messageID": data.messageID
            };
            if (data.good) {
                var updateStr = {
                    $set: {
                        "good": data.good
                    }
                };
            } else if (data.reply) {
                var updateStr = {
                    $set: {
                        "reply": data.reply
                    }
                };
            }

            collection.update(whereStr, updateStr, function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    reject({
                        success: 0
                    })
                }
                db.close();
                resolve({
                    success: 1
                })
            });
        });
    });
    promise.then(function(value) {
        res.send(value)
    })
}

var delData = function(db, callback) {
    //连接到表  
    var collection = db.collection('messages');
    //删除数据
    var whereStr = {
        "name": '菜鸟工具'
    };
    collection.remove(whereStr, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

var account = {
    MongoClient: require('mongodb').MongoClient,
    DB_CONN_STR: 'mongodb://yifan0817:950817@127.0.0.1:27017/test', //数据库为 test
    insertData: insertData,
    selectData: selectData,
    updateData: updateData,
    delData: delData,
    getAllUsers: getAllUsers
};
module.exports = account;