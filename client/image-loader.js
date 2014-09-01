var async = require('async');

var imageList = ['/img/benterprise1.png'];

function imageLoader(done) {
	var taskList = [];
	imageList.forEach(function(thisPath) {
		taskList.push(function(cb) {
			var thisImage = new Image();
			thisImage.onload = function() {
				cb();
			};
			thisImage.src = thisPath;
		});
		async.parallelLimit(taskList, 6, done);
	});
}

module.exports = imageLoader;