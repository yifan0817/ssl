var insertData = function(data) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('login');
            collection.insert(data, function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    reject({
                        success: 0
                    })
                }
                //console.log(result);
                db.close();
                resolve({
                    success: 1
                });
            });
        });
    });
    promise.then(function(value) {
        console.log(data.sessionid + '添加成功');
    })
}

var selectData = function(search, res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('login');
            collection.find(search).toArray(function(err, result) {
                if (err) {
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
        if (value.length) {
            res.json({
                isLoad: true
            })
        } else {
            res.json({
                isLoad: false
            })
        }
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

var delData = function(search, res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject) {
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('login');
            collection.remove(search, function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    reject(err);
                }
                db.close();
                resolve(result)
            });
        });
    });
    promise.then(function(value) {
        console.log(search.sessionid+'退出成功');
        res.json({
            success: true
        })
    }, function() {
        res.json({
            success: false
        })
    })
}

var loginstat = {
    MongoClient: require('mongodb').MongoClient,
    DB_CONN_STR: 'mongodb://yifan0817:950817@127.0.0.1:27017/test', //数据库为 test
    insertData: insertData,
    selectData: selectData,
    updateData: updateData,
    delData: delData
};
module.exports = loginstat;