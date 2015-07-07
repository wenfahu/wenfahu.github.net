var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('less', function(){
    return gulp.src('./less/*.less')
	.pipe(less())
	.pipe(gulp.dest('./css'))
	.pipe(browserSync.stream());
});

gulp.task('minify-css', function(){
    return gulp.src('./css/bootstrap.css')
	.pipe(minifyCss())
	.pipe(rename({
	    suffix:'.min'
	}))
	.pipe(gulp.dest('./css'));
});

gulp.task('dev', ['less'], function(){
    browserSync.init({
	server:{
	    baseDir: "./"
	}
    });

    gulp.watch('./less/*.less', ['less']);
    gulp.watch('./index.html').on('change', browserSync.reload);
});

gulp.task('default', ['dev']);
