/**
 * 功能描述：
 * 1.编译html模板
 * 2.合并图片生成雪碧图和对应的less
 * 3.编译less
 */

var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var ejs = require('gulp-ejs');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

// 不编译复制文件
gulp.task('clean:copy', function(){
    del(['src/assets/js/**']);
    del(['src/assets/lib/**']);
});
gulp.task('copy', ['clean:copy'], function(){
    gulp.src(['src/assets/js/**','src/assets/lib/**'])
        .pipe(gulp.dest('build/assets/'));
});

// html模板引擎
gulp.task('clean:ejs', function(){
    return del(['build/**/*.html','!build/assets/lib/**']);
});
gulp.task('ejs', ['clean:ejs'], function () {
    return gulp.src(['src/**/*.html', '!src/tmpl/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(ejs())
        .pipe(gulp.dest('build'))
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
        .pipe(gulp.dest('build/assets/images/'));

    // css流
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/assets/less/import/'));

    // 返回合并流
    return merge(imgStream, cssStream);
});

// less
gulp.task('clean:less', function(){
    return del(['build/assets/css/**'])
});
gulp.task('less',['clean:less'], compileLess);

// 依赖sprite的less
gulp.task('sprite_less', ['clean:less','sprite'], compileLess);

// 编译less方法
function compileLess(){
    return gulp.src(['src/assets/less/**/*.less','!src/assets/less/import/**'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('../map/'))
        .pipe(gulp.dest('build/assets/css/'))
}

// build 测试环境
gulp.task('build', ['copy','ejs', 'sprite_less']);

// dist 生产环境
gulp.task('dist', ['build'], function(){
    return gulp.src(['build/**'])
        .pipe(gulp.dest('dist/'))
});

// 监听
gulp.task('default', ['build'], function () {
    gulp.watch(['src/assets/js/**/*.*','src/assets/lib/**/*.*'], ['copy']);
    gulp.watch(['src/**/*.html'], ['ejs']);
    gulp.watch(['src/assets/images/icons/*.png'], ['sprite']);
    gulp.watch(['src/assets/less/**/*.*'], ['less']);
});
