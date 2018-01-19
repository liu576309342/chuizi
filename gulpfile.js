var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var uglifyJs = require('gulp-uglify');
var connect  = require('gulp-connect');
var rubySass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var minifyHtml = require('gulp-htmlmin');
// var cleanCss = require('gulp-clean-css');

gulp.task('testHtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./html/*.html')
        .pipe(minifyHtml(options))
        .pipe(gulp.dest('dist/html'));
});

gulp.task('testImagemin', function () {
    return gulp.src('./images/*.{png,jpg,gif,ico,webp}')
    // .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest('./dist/images/'))
});

// gulp.task('minifyCss', function () {
//     return gulp.src('./css/*.css')
//     .pipe(cleanCss())
//     .pipe(gulp.dest('./dist/css/'));
// });
// 编译Sass
gulp.task('sass', function () {
    return rubySass('./sass/*.scss', {
        sourcemap: false,
        style: 'compressed',
    }).pipe(gulp.dest('./dist/css/'));
});

// 压缩JS
gulp.task('minifyJs', function () {
    return gulp.src('./js/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./dist/js/'));
});
// 监听Html
gulp.task('html', ['sass', 'minifyJs','testHtmlmin','testImagemin'], function () {
    return gulp.src('./*.html').pipe(connect.reload());
});
// 监听
gulp.task('default', ['sass', 'minifyJs','testHtmlmin','testImagemin'], function () {
    // 开启服务器
    connect.server({
        port: 9001,
        livereload: true
    });
    // gulp.watch('./images/*.{png,jpg,gif,ico}',['html']);
    gulp.watch('./html/*.html',['html']);
    gulp.watch('./css/*.css', ['html']);
    gulp.watch('./js/*.js', ['html']);
});