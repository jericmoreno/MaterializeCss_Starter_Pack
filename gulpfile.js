const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const htmlmin = require('gulp-htmlmin');

//Compile sass and inject to browser
gulp.task('sass', function(){
    return gulp.src(['node_modules/materialize-css/sass/materialize.scss', 'src/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

//Move JS Files to src/js
gulp.task('js', function(){
    return gulp.src(['node_modules/materialize-css/dist/js/materialize.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/hammerjs/hammer.min.js'])
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

// Watch Sass & Server
gulp.task('serve', ['sass'], function(){
    browserSync.init({
        server: "./src"
    });
    gulp.watch(['node_modules/materialize-css/sass/materialize.scss', 'src/scss/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Move Fonts Folder to src
gulp.task('fonts', function(){
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest("src/fonts/fontawesome"));
});

// Move Font Awesome CSS to src/css
gulp.task('fa', function(){
    return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
    .pipe(gulp.dest("src/css"));
});

gulp.task('default', ['js', 'serve', 'fa', 'fonts']);



/*  JUST TO PROVIDE A MINIFIED VERSION OF ALL THE FILES */


// Move Fonts Folder to production
gulp.task('prodfonts', function(){
    return gulp.src('src/fonts/font-awesome/fonts/*')
    .pipe(gulp.dest("production/fonts"));
});

// Uglify all html files
gulp.task('prodminhtml', function() {
    return gulp.src('src/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('production'));
  });

// Optimize Image
gulp.task('imageMin', () => gulp.src('src/img/*').pipe(imagemin()).pipe(gulp.dest('production/img')) );

// Uglify all js files
gulp.task('produglify', function(){
    gulp.src('src/js/*.js').pipe(uglify()).pipe(gulp.dest('production/js'));
});

// Uglify all css files
gulp.task('prodcss', function () {
    gulp.src('src/css/*.css')
      .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
      }))
      .pipe(gulp.dest('production/css'));
  });

  //Running all in one
gulp.task('production', ['prodfonts', 'prodminhtml', 'imageMin', 'produglify', 'prodcss' ]);
