var insertData = function(data, res) {   
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject){
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('messages');
            collection.insert(data, function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    reject({
                        success:0
                    })
                }
                //console.log(result);
                db.close();
                resolve({
                    success:1
                });
            });
        });
    });
    promise.then(function(value){
        res.send(value)
    })
}

var selectData = function(search,res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject){
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('messages');
            collection.find(search).toArray(function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    reject(err)
                }
                var returndata = JSON.stringify(result);
                // console.log(returndata);//在这里可以正常获取
                db.close();
                resolve(returndata)
            });
        });
    });
    promise.then(function(value){
        res.send(value)
    })
}

var updateData = function(data, res) {
    var returndata,
        that = this;
    var promise = new Promise(function(resolve, reject){
        that.MongoClient.connect(that.DB_CONN_STR, function(err, db) {
            console.log("连接成功！");
            var collection = db.collection('messages');
            //更新数据
            var whereStr = {
                "messageID": data.messageID
            };
            if(data.good){
                var updateStr = {
                    $set: {
                        "good": data.good
                    }
                };
            }else if(data.reply){
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
                        success:0
                    })
                }
                db.close();
                resolve({
                    success:1
                })
            });
        });
    });
    promise.then(function(value){
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

var messages = {
    MongoClient: require('mongodb').MongoClient,
    DB_CONN_STR: 'mongodb://yifan0817:950817@127.0.0.1:27017/test', //数据库为 test
    insertData: insertData,
    selectData: selectData,
    updateData: updateData,
    delData: delData
};
module.exports = messages;