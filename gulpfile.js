/**
 * 功能描述：
 * 1.编译html模板
 * 2.合并图片生成雪碧图和对应的less
 * 3.编译less
 */

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var ejs = require('gulp-ejs');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

// 不编译复制文件
gulp.task('copy', function(){
    gulp.src(['src/assets/**/js/**','src/assets/**/lib/**'])
        .pipe(gulp.dest('dist/assets/'));
});


// html模板引擎
gulp.task('ejs', function () {
    return gulp.src(['src/**/*.html', '!src/htmlTemp/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(ejs())
        .pipe(gulp.dest('dist'))
});

// 图片精灵
gulp.task('sprite', function () {
    // 生成sprite
    var spriteData = gulp.src('src/assets/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.less',
        imgPath: '../images/sprite.png'
    }));

    // 图片流
    var imgStream = spriteData.img
        .pipe(gulp.dest('dist/assets/images/'));

    // css流
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/assets/less/import/'));

    // 返回合并流
    return merge(imgStream, cssStream);
});

// less
gulp.task('less', compileLess);

// 依赖sprite的less
gulp.task('sprite_less', ['sprite'], compileLess);

// 编译less方法
function compileLess(){
    return gulp.src(['src/assets/less/**/*.less','!src/assets/less/import/**'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('../map/'))
        .pipe(gulp.dest('dist/assets/css/'))
}
// build
gulp.task('build', ['copy','ejs', 'sprite_less']);

// 监听
gulp.task('default', ['build'], function () {
    gulp.watch(['src/assets/js/**/*.*','src/assets/lib/**/*.*'], ['copy']);
    gulp.watch(['src/**/*.html'], ['ejs']);
    gulp.watch(['src/assets/images/icons/*.png'], ['sprite']);
    gulp.watch(['src/assets/less/**/*.*'], ['less']);
});
