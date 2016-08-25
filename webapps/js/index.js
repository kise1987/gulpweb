var msgCache = [],
	timer;
$(function() {
	var socket = io('http://'+location.hostname+':3000');
	socket.on('connect', function() {
		console.log('connect')
	});
	socket.on('news', function(data) {
		if (data.msg) {
			msgCache.push(data.msg.replace(/\n/g, ''));
			if (!timer) {
				appendMsg();
			}
		}
	});
	socket.on('errorMsg', function(data) {
		if (data.msg) {
			msgCache.push('<span class="red">'+data.msg.replace(/\n/g, '')+'</span>');
			if (!timer) {
				appendMsg();
			}
		}
	});
	// 检测执行状态，修改按钮状态
	socket.on('gulpStatus', function(data) {
			$('#startgulp').removeClass('disabled');
	});
	socket.on('disconnect', function() {
		console.log('disconnect')
	});

	$('#startgulp').on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();
		if($(this).hasClass('disabled')){
			return false;
		}
		var svnUrl = $('#svnUrl').val();
			// username = $('#svnUserName').val(),
			// password = $('#svnPassword').val();
		if (svnUrl) {
			$(this).addClass('disabled');
			socket.emit('startgulp', {
				svnUrl: $('#svnUrl').val(),
				// username: $('#svnUserName').val(),
				// password: $('#svnPassword').val()
			})
		}
	});
})

function appendMsg() {
	timer = setInterval(function() {
		var val = $('#msg').html();
		val = val ? val + '<br>' : '';
		if (msgCache.length > 0) {
			$('#msg').html(val + msgCache.join('<br>'));
			msgCache = [];
			$('#msg').scrollTop($('#msg')[0].scrollHeight)
		} else {
			clearInterval(timer);
			timer = null;
		}
	}, 10)
}