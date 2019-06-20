// khai bao bien cho cac plugin
// $ npm install [plugin_name] --save-dev (cau len install plugin trong cmd)
var gulp = require('gulp'); // khoi tao gulp
var sass = require('gulp-sass'); // bien dich sass sang css
var browserSync = require('browser-sync').create(); //auto load fie (plugin:gulp-livereload)
var useref = require('gulp-useref'); // noi fie
var del = require('del'); // delete thu muc
var runSequence = require('run-sequence'); // 1 cau lenh chay cho nhieu task
var nunjucksRender = require('gulp-nunjucks-render'); // Module hóa HTML với các template engine
var uglify = require('gulp-uglify'); //minifying  file js
var gulpIf = require('gulp-if');//minifying  file js
var cssnano = require('gulp-cssnano');//minifying  file css

// clean:dist (delete dis)
gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
})

// copy fie to dis
gulp.task('html', function(){
  	return gulp.src('app/*.html')
	    // .pipe(useref()) // noi fie
	    .pipe(gulp.dest('dist'))
	  //   .pipe(browserSync.reload({// auto load fie css (hoac go lenh line 34)
			// stream: true
	  //   }))
});

gulp.task('images', function() {
	return gulp.src('app/images/**/*')
		.pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function() {
	return gulp.src('app/webfonts/**/*')
		.pipe(gulp.dest('dist/webfonts'))
})

gulp.task('style', function() {
	return gulp.src('app/css/**/*')
		.pipe(gulp.dest('dist/css'))
})

gulp.task('js', function() {
	return gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'))
})

//Browser Sync (auto load page)
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
		  baseDir: 'app'
		},
	})
})

// bien dich sass 
gulp.task('sass', function(){
  return gulp.src('app/scss/style.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({// auto load fie css (hoac go lenh line 34)
		stream: true
    }))
});

// Watch Files For Changes
// Gulp watch syntax (auto load page)
// one task 1 (// khi fie html thay doi thi thuc hien task ['task_name'])
gulp.task('watch', ['browserSync', 'sass'], function (){
	gulp.watch('app/scss/**/*.scss', ['sass']); 
	// Other watchers
	// browserSync all fie
	// gulp.watch('app/*.html', ['html']); // khi fie html thay doi thi thuc hien task ['html']
	// gulp.watch('app/js/*.js', ['js']); // auto load fie js
	// gulp.watch('app/images/*.+(png|jpg|jpeg|gif|svg)', ['images']); // auto load fie js
	// gulp.watch('app/webfonts/*.+(eot|otf|svg|ttf|woff|woff2)', ['fonts']); // auto load fie js
	// gulp.watch('app/css/**/*', ['style']);
	gulp.watch('app/**/*.html', ['nunjucks']); // auto load fie js
	gulp.watch('app/page/**/*.+(html|nunjucks)', ['nunjucks']); // auto load fie js
	gulp.watch('app/templates/**/*.+(html|nunjucks)', ['nunjucks']); // auto load fie js
	gulp.watch('app/js/*.js', browserSync.reload); // auto load fie js
	gulp.watch('app/images/*.+(png|jpg|jpeg|gif|svg)', browserSync.reload); // auto load fie js
	gulp.watch('app/webfonts/*.+(eot|otf|svg|ttf|woff|woff2)', browserSync.reload); // auto load fie js
	gulp.watch('app/css/*.css', browserSync.reload); // auto load fie js
});

// create a nunjucks task that coverts index.nunjucks into index.html
gulp.task('nunjucks', function() {
	// Gets .html and .nunjucks files in pages
	return gulp.src('app/pages/**/*.+(html|nunjucks)')
	// Renders template with nunjucks
	.pipe(nunjucksRender({
		path: ['app/templates']
	}))
	// output files in app folder
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({// auto load fie css (hoac go lenh line 34)
		stream: true
    }))
});

//toi uu js
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

//toi uu css
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Default Task
//Combine Gulp missions (one task 2)
gulp.task('build', function (callback) {// build khi bat dau va build khi ket thuc (vi khi xoa fie ben dis ko xoa)
  runSequence('clean:dist', 
    ['sass','html','images','fonts','style','js'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence('watch',
    callback
  )
})