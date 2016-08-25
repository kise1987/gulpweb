var gulp = require('gulp'),
	cssmin = require('gulp-cssmin'),
	uglify = require('gulp-uglify'),
	sftp = require('gulp-sftp'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache');

var path = (process.argv[3] || '') + '/src/main/webapp/';
console.log('workPath:',path);
	// js min
gulp.task("jsmin", function() {
		return gulp.src(path + 'develop/js/*.js')
			.pipe(uglify())
			.pipe(gulp.dest(path + 'static/js'));
	})
	// cssmin
gulp.task("cssmin", function() {
		return gulp.src(path + 'develop/css/**/*.css')
			.pipe(cssmin())
			.pipe(gulp.dest(path + 'static/css'));
	})
	// copy images
	// gulp.task("copy", function() {
	// 	return gulp.src(path + 'develop/images/**/*.*')
	// 		.pipe(gulp.dest(path + 'testugfily/images'));
	// })

// 图片压缩
gulp.task('imagemin', function() {
	gulp.src(path + 'develop/images/**/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
			optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
			multipass: false, //类型：Boolean 默认：false 多次优化svg直到完全优化
			svgoPlugins: [{
				removeViewBox: false //不要移除svg的viewbox属性
			}],
			use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		})))
		.pipe(gulp.dest(path + 'static/images'));
});
//'jsmin', 'cssmin', 'imagemin'
gulp.task('default', ['jsmin', 'cssmin']);
// gulp.task('default', ['imagemin']);