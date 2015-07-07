var gulp = require('gulp');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
//var browserSync = require('browser-sync');

gulp.task('less', function(){
    return gulp.src('./less/*.less')
	.pipe(less())
	.pipe(gulp.dest('./css'));
});

gulp.task('minify-css', function(){
    return gulp.src('./css/bootstrap.css')
	.pipe(minifyCss())
	.pipe(rename({
	    suffix:'.min'
	}))
	.pipe(gulp.dest('./css'));
});

/*
gulp.task('browser-sync', function() {
    browserSync({
	proxy: 'localhost:8080'
    });
}); 
*/

gulp.task('dev', function(){
    gulp.watch('./less/*.less', ['less']);
});

