'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass'); // препроцессор
var plumber = require('gulp-plumber'); // позволяет создать цепочку обработки процесса
var postcss = require('gulp-postcss'); // для автопрефексера
var mqpacker = require('css-mqpacker'); // объединяет media выражения в css
var autoprefixer = require('autoprefixer'); // автопрефиксер css
var server = require('browser-sync').create(); // локальный сервер
var minify = require('gulp-csso'); // минификация css
var rename = require('gulp-rename'); // позволяет сохранить файл с переименовыванием (копию)
var uglify = require('gulp-uglify'); // минификация js
var run = require('run-sequence'); // позволяет выполнять задачи, дожидаясь выполнения предидущей
var del = require('del'); // позволяет удалить папку\файл
var babel = require('gulp-babel'); // babal, транспилирует код ES6 в ES5

/* для создания svg спрайта */ 
// var svgMin = require('gulp-svgmin'); // в devDependences не прописано
// var svgStore = require('gulp-svgstore'); // в devDependences не прописано
gulp.task('babel', () =>
  gulp.src('src/*.js')
    .pipe(babel({presets: ['env']}))
    .pipe(gulp.dest('dist'))
);

gulp.task('babelWatcher', function () {
    gulp.watch('src/*.js', ['babel']); // при изменении sass файлов пересобирать css файл
});

gulp.task('style', function() {
    gulp.src('sass/style.scss')
        .pipe(plumber())
            .pipe(sass()) // преобразует sass в css
                .pipe(postcss([
                    autoprefixer({browsers: [
                        'last 2 versions' // автопрефиксер для 2х последних версий браузеров
                    ]}),
                    mqpacker({
                        sort: true // объединяем медиавыражения
                    })
                ]))
                    .pipe(gulp.dest('css'))
                        .pipe(minify()) // минификация css
                            .pipe(rename('style.min.css')) // переименование минифицированной копии
                                .pipe(gulp.dest('css')) // сохранение
                                    .pipe(server.stream()); // запуск локального сервера
});

gulp.task('server', function() { 
    server.init({ // параметры локального сервера
        server: '.',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch('sass/**/*.{scss,sass}', ['style']); // при изменении sass файлов пересобирать css файл
    gulp.watch('dist/*.js').on('change', server.reload); // при изменении js файлов перезагружать сервер
    gulp.watch('*.html').on('change', server.reload); // при изменении html файлов перезагружать сервер
});

gulp.task('jsMin', function() {
    return gulp.src('dist/*.js') // взять из папки js из всех подпапок все js файлы
                    .pipe(uglify()) // минифицировать копии
                        .pipe(gulp.dest('build/dist')); // записать в указанном месте
});

gulp.task('makeCopyes', function(){
    return gulp.src([ // взять файлы
        '*.html',
        'css/**',
        'polyfills/**' 
    ],{
        base: '.' // откуда (корневая папка)
    },).pipe(gulp.dest('build')); // куда сохранить копии
});

gulp.task('cleanBuild', function(){
    return del('build'); // удаляет папку или файл
});

gulp.task('dev', function(cb){
    run('babel', 'babelWatcher', 'server', cb); // цепочка вызова для версии для разработки
});

gulp.task('build', function(cb){
    run('cleanBuild', 'babel', 'jsMin', 'style', 'makeCopyes', cb); // цепочка вызова тасков при создании build версии, callback сообщает о завершении выполнения всех тасков    
});