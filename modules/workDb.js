var fs = require('fs');
var fileName = 'db.json';
module.exports = {
		getCatch : getCatch,
		saveDB : saveDB
};
function getCatch(){
	var data = JSON.parse(fs.readFileSync('db.json','utf-8'));
	global.workCatch = data.workCatch || {};
}
function saveDB() {
	var data = {
		workCatch:global.workCatch
	};
	fs.writeFileSync('db.json',JSON.stringify(data));
}
//workCatch