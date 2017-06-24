/**
 * 功能描述：
 * 1.编译html模板
 * 2.合并图片生成雪碧图和对应的less
 * 3.编译less
 */

const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const ejs = require('gulp-ejs');
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const less = require('gulp-less');
const autoprefixer = require("gulp-autoprefixer")
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const order = require('gulp-order');

/**
 * html模板引擎ejs
 */
gulp.task('clean:ejs', function(){
    return del(['build/**/*.html','!build/assets/**']);
});
gulp.task('ejs', ['clean:ejs'], function () {
    return gulp.src(['src/**/*.{html,ejs}','!src/**/_*.{html,ejs}','!src/assets/**'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(ejs({it:{}}, {ext:'.html'}))
        .pipe(gulp.dest('build'))
});

/**
 * less
 */
gulp.task('clean:less', function(){
    return del(['build/assets/css/**'])
});
gulp.task('less',['clean:less'], compileLess);

// 依赖sprite的less
gulp.task('sprite-less', ['clean:less','sprite'], compileLess);

// 编译less方法
function compileLess(){
    return gulp.src(['src/assets/less/**/*.less','!src/assets/less/**/_*.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('../../../_map/css'))
        .pipe(gulp.dest('build/assets/css/'))
}

/**
 * 合并js
 */
var oderConfig = require('./_config/concat_order');
gulp.task('concatjs', function () {
    gulp.src(['src/assets/js/common/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(order(oderConfig))
        .pipe(concat('common.js'))
        .pipe(sourcemaps.write('../../../_map/js/common/'))
        .pipe(gulp.dest('build/assets/js/'))
});

/**
 * 图片精灵
 */
const spriteConfig = require('./_config/sprite');

// 各精灵图的src
var spritesSrc = {};
spritesSrc.img = spriteConfig.map(function (val) {
    return 'build/assets/images/' + val.imgName;
});
spritesSrc.less = spriteConfig.map(function (val) {
    return 'src/assets/less/import/' + val.cssName;
});
gulp.task('clean:sprite', function () {
    console.log(spritesSrc)
    return del(spritesSrc.img.concat(spritesSrc.less));
});
gulp.task('sprite', ['clean:sprite'], function () {
    var streamArr = [];
    spriteConfig.forEach(function (val) {
        console.log(val)
        // 生成sprite
        var spriteData = gulp.src(val.src).pipe(spritesmith(val));

        // 图片流
        var imgStream = spriteData.img
            .pipe(gulp.dest('build/assets/images/'));

        // css流
        var cssStream = spriteData.css
            .pipe(gulp.dest('src/assets/less/import/'));

        streamArr.push(imgStream);
        streamArr.push(cssStream);
    });
    // 返回合并流
    return merge.apply(merge, streamArr);
});

/**
 * 复制image文件
 */
var cleanImgSrc = spritesSrc.img.map(function (val) {
    return '!' + val
});
cleanImgSrc.unshift('build/assets/images/**/*.*');
gulp.task('clean:copy_img', function () {
    return del(cleanImgSrc)
});
gulp.task('copy_img', ['clean:copy_img'], function () {
    return gulp.src(['src/assets/**/images/**', '!src/assets/images/sprites/**', '!src/assets/images/sprites'])
        .pipe(gulp.dest('build/assets/'));
});

/**
 * 复制js文件
 */
gulp.task('clean:copy_js', function () {
    return del(['build/assets/js/**'])
});
gulp.task('copy_js', ['clean:copy_js'], function () {
    return gulp.src(['src/assets/**/js/**', '!src/assets/js/common/**', '!src/assets/js/common'])
        .pipe(gulp.dest('build/assets/'))
});

/**
 * 复制lib文件
 */
gulp.task('clean:copy_lib', function () {
    return del(['build/assets/lib/**'])
});
gulp.task('copy_lib', ['clean:copy_lib'], function () {
    return gulp.src(['src/assets/**/lib/**'])
        .pipe(gulp.dest('build/assets/'));
});

/**
 * 复制文件
 */
gulp.task('copy', ['copy_img', 'copy_js', 'copy_lib']);

/**
 * build 测试环境
 */
gulp.task('build', ['ejs', 'sprite-less', 'concatjs', 'copy']);

/**
 * dist 生产环境
 */
gulp.task('dist', ['build'], function(){
    return gulp.src(['build/**'])
        .pipe(gulp.dest('dist/'))
});

// 监听
gulp.task('default', ['build'], function () {
    gulp.watch(['src/assets/images/**'], ['copy_image']);
    gulp.watch(['src/assets/js/**'], ['copy_js']);
    gulp.watch(['src/assets/lib/**'], ['copy_lib']);
    gulp.watch(['src/**/*.html'], ['ejs']);
    gulp.watch(['src/assets/sprites/*.png'], ['sprite']);
    gulp.watch(['src/assets/less/**'], ['less']);
});
