var fs = require('fs');
var Q = require('q');
var exec = require('./exec.js')
var workDb = require('./workDb.js');

var gPath = process.cwd();
var svnPath = gPath + '/svnworkspace';
var gulpPath = gPath + '/gulp';
var socket;
var svnUrl, username, password, pathName;
module.exports = function(sobj, opts) {
		socket = sobj;
		svnUrl = opts.svnUrl;
		username = opts.username;
		password = opts.password;
		pathName = svnUrl.match(/[^\/]+/g).pop();
		socket.emit('news', {
			'msg': 'get the order'
		});
		global.isworking[svnUrl] = 1;
		dosvnco().then(dogulp).then(getAddFile).then(svnAdd).then(svnCommit).then(successed);
	}
	// svn check out;
function dosvnco() {
	var deferred = Q.defer();
	if (!global.workCatch[svnUrl]) {
		// 如果缓存不存在执行svn checkout
		// 先创建文件夹
		pathName = pathName + new Date().getTime();
		fs.mkdirSync(svnPath + '/' + pathName);
		global.workCatch[svnUrl] = pathName;
		workDb.saveDB();
		var cmdstr = 'svn co ' + svnUrl + ' ' + pathName + ' --username ' + username + ' --password ' + password;
		exec({
			deferred: deferred,
			cmdstr: cmdstr,
			sendMsg: sendMsg,
			path: svnPath,
			name: 'svn checkout'
		}, svnUrl)
	} else {
		pathName = global.workCatch[svnUrl];
		// 执行svn update
		var cmdstr = 'svn up ' + global.workCatch[svnUrl] + ' --username ' + username + ' --password ' + password;
		exec({
			deferred: deferred,
			cmdstr: cmdstr,
			sendMsg: sendMsg,
			path: svnPath,
			name: 'svn update'
		}, svnUrl);
	}
	return deferred.promise;
}

// msg send
function sendMsg(type, msg) {
	socket.emit(type, {
		'msg': msg
	});
}

// 执行gulp
function dogulp(code) {
	var deferred = Q.defer();
	var cmdstr = 'gulp --workPath ' + svnPath + '/' + pathName;
	exec({
		deferred: deferred,
		cmdstr: cmdstr,
		sendMsg: sendMsg,
		path: gulpPath,
		name: 'gulp'
	}, svnUrl)
	return deferred.promise;
}

function getAddFile() {
	console.log('getAddFile')
	var deferred = Q.defer();
	var cmdstr = 'svn st | grep ? | sed "s/^?[ ]*//"';
	exec({
		deferred: deferred,
		cmdstr: cmdstr,
		sendMsg: sendMsg,
		path: svnPath + '/' + pathName,
		name: 'getAddFile'
	}, svnUrl)
	return deferred.promise;
}
// svn 添加文件
function svnAdd(arr) {
	var deferred = Q.defer();
	var cmdstr = 'svn st | grep ? | sed "s/^?[ ]*//" | xargs svn add'+' --username ' + username + ' --password ' + password;
	if (arr && arr.length > 0) {
		exec({
			deferred: deferred,
			cmdstr: cmdstr,
			sendMsg: sendMsg,
			path: svnPath + '/' + pathName,
			name: 'svn add'
		}, svnUrl)
	}else{
		deferred.resolve();
	}
	return deferred.promise;
}
// svn 添加文件
function svnCommit() {
	var cmdstr = "svn ci -m 'gulp提交压缩后代码，如有问题联系kise'"+' --username ' + username + ' --password ' + password;
	var deferred = Q.defer();
	exec({
		deferred: deferred,
		cmdstr: cmdstr,
		sendMsg: sendMsg,
		path: svnPath + '/' + pathName,
		name: 'svn Committed'
	}, svnUrl)
	return deferred.promise;
}

function successed() {
	var deferred = Q.defer();
	sendMsg('gulpStatus', 0);
	global.isworking[svnUrl] = 0;
	deferred.resolve();
	return deferred.promise;
}