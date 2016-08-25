var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dogulp = require('./modules/dogulp.js');

var workDb = require('./modules/workDb.js');
workDb.getCatch();

global.isworking = {};

app.set('view engine', 'jade');
app.set('views', './webapps/views/');
app.use(express.static('webapps'));
app.use(favicon(__dirname + '/webapps/favicon.ico'));
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
	res.render('index', {
		title: 'Hey',
		message: 'Hello there!'
	});
});
http.listen(3000);
io.on('connection', function(socket) {
	socket.emit('news', {
		msg: 'hello world'
	});
	socket.on('startgulp', function(data) {
		console.log('svnUrl:', data.svnUrl);
		if (global.isworking[data.svnUrl]) {
			socket.emit('errorMsg', {
				msg:'svn url: ' +data.svnUrl + ' working in progress,please wait a moment!'
			});
		} else {
			dogulp(socket, {
				svnUrl: data.svnUrl,
				username: 'test',
				password: 'test'
			});
		}
	});
});
