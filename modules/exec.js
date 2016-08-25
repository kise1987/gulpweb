var cp = require('child_process');
module.exports = function(opts,svnUrl) {
	var sendMsg = opts.sendMsg,
		deferred = opts.deferred,
		arr = [];
	var cmd = cp.exec(opts.cmdstr /*command*/ , {
		encoding: 'utf8',
		timeout: 0,
		/*子进程最长执行时间 */
		maxBuffer: 1024 * 1024,
		/*stdout和stderr的最大长度*/
		killSignal: 'SIGTERM',
		cwd: opts.path,
		env: null
	});
	cmd.stdin.on('data', function(data) {
		sendMsg('news',data);
	});
	cmd.stdout.on('data', function(data) {
		arr.push(data);
		sendMsg('news',data);
	});
	cmd.stderr.on('data', function(data) {
		global.isworking[svnUrl] = 0;
		sendMsg('errorMsg',data);
		deferred.reject();
		sendMsg('gulpStatus',0);
	});
	cmd.on('exit', function(code) {
		sendMsg('news',opts.name + ' end code:' + code);
		console.log('aaa:'+opts.name);
		console.log(arr);
		deferred.resolve(arr);
	});
	return deferred.promise;
}