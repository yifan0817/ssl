var news = {};
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://yifan0817:950817@127.0.0.1:27017/test'; //数据库为 test

news.getNewsList = function(req, res) {
	var that = this;
	var promise = new Promise(function(resolve, reject) {
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			console.log("连接成功！");
			var collection = db.collection('news');
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
		var start = req.query.start - 0,
			size = req.query.size - 0;
		var returnData = value.slice(start, start + size)
		res.json({
			success: true,
			newsList: returnData
		})
	}, function() {
		res.json({
			success: false
		})
	})
}

news.insertNewsList = function(req, res) {
	var that = this;
	var data = req.body;
	var promise = new Promise(function(resolve, reject) {
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			console.log("连接成功！");
			var collection = db.collection('news');

			collection.insert(data, function(err, result) {
				if (err) {
					console.log('Error:' + err);
					reject({
						success: false,
						err: err
					})
				}
				db.close();
				resolve({
					success: true
				});
			});
		});
	});
	promise.then(function(value) {
		console.log(value);
		console.log('添加新闻成功');
		res.json({
			success: true
		})
	}, function(value) {
		console.log('添加新闻错误');
		res.json(value)
	})
}

news.replyNews = function(req, res) {
	var that = this;
	var data = req.body;
	var promise = new Promise(function(resolve, reject) {
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			console.log("连接成功！");
			var collection = db.collection('news');
			//更新数据
			var whereStr = {
				"title": data.title
			};
			var updateStr = {
				$set: {
					"reply": data.reply
				}
			};

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

module.exports = news;