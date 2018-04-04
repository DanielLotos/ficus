var gulp = require('gulp'), // Подключаем Gulp
  //less = require('gulp-less'), // Подключаем LESS-пакет
  sass = require('gulp-sass'), //Подключаем SASS-пакет
	plumber = require('gulp-plumber'), // Отслеживает ошибки
	postcss = require('gulp-postcss'), // Сборка библиотек для удобного редактирования CSS. Без нее не работает mqpacker
	autoprefixer = require('autoprefixer'), // Подключаем библиотеку для автоматического подставления префиксов для кроссбраузерности
	server = require('browser-sync').create(), // Подключаем Browser Sync
	mqpacker = require('css-mqpacker'), // Группирует медиа-запросы и подставляет их в конце файла
	csso = require('gulp-csso'), // CSS-минификатор
	pug = require('gulp-pug'), // Подключаем компилятор Pug
	rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	imagemin = require('gulp-imagemin'), // Подключаем библиотеку для сжатия картинок
	minify = require('gulp-minify'), // Подключаем библиотеку для сжатия JS-файлов
	copy = require('gulp-copy'), // Копирует в новое место и задает это место изначальным.
	run = require('run-sequence'), // Сборщик. Задает порядок сборки
	del = require('del'); // Подключаем библиотеку для удаления файлов и папок ! Для очистки нашей продакшен-папки

gulp.task('pug-html', function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('dist/'))
});

gulp.task('style', function() {
  gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 2 versions'
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(csso())
    .pipe(server.stream())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.stream())
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.{svg,jpg,png,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('compress', function() {
  gulp.src('src/js/*.js')
    .pipe(minify({
      ext:{
        src:'.js',
        min:'.min.js'
      },
      ignoreFiles: ['-min.js', 'jquery.js']
    }))
    .pipe(gulp.dest('dist/js'))
});

// gulp.task('copy', function() {
//   return gulp.src([
//     'app/**/*.js',
//     'app/**/*.{svg,jpg,png,gif}'])
//     .pipe(gulp.dest('dist/'));
// });

gulp.task("clean", function() {
  return del("dist");
});

gulp.task('server', function() {
  server.init({
    server: 'dist',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('src/sass/**/*.scss', ['style']);
  gulp.watch('src/pug/**/*.pug', ['pug-html']);
  gulp.watch('src/js/**/*.js', ['compress']);
  gulp.watch('dist/*.html', function() {
    server.reload()
  });
});

gulp.task('build', function(done) {
  run('clean', 'pug-html', 'style', 'images', 'compress', done);
});

