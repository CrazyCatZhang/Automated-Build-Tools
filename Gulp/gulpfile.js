const {task, src, dest, watch, series, parallel} = require('gulp');
const $ = require('gulp-load-plugins')();
const open = require('open');

function js() {
    return src('src/js/*.js')
        .pipe($.concat('all.js'))
        .pipe(dest('dist/js'))
        .pipe($.rename('all.min.js'))
        .pipe($.uglify())
        .pipe(dest('dist/js'))
        .pipe($.livereload())
        .pipe($.connect.reload());
}

function less_css() {
    return src('src/less/*.less')
        .pipe($.less())
        .pipe(dest('src/css'))
        .pipe($.livereload())
        .pipe($.connect.reload());
}

function css() {
    return src('src/css/*.css')
        .pipe($.concat('all.css'))
        .pipe(dest('dist/css'))
        .pipe($.rename('all.min.css'))
        .pipe($.cleanCss())
        .pipe(dest('dist/css'))
        .pipe($.livereload())
        .pipe($.connect.reload());
}

function html() {
    return src('index.html')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(dest('dist'))
        .pipe($.livereload())
        .pipe($.connect.reload());
}

function watch_files() {
    $.livereload.listen();
    watch('src/js/*.js', series(js));
    watch('src/less/*.less', series(less_css));
    watch('src/css/*.css', series(css));
    watch('index.html', series(html));
}

function server(done) {
    series('default');
    $.connect.server({
        root: 'dist',
        port: 3000,
        livereload: true
    });
    open('http://localhost:3000');
    watch('src/js/*.js', series(js));
    watch('src/less/*.less', series(less_css));
    watch('src/css/*.css', series(css));
    watch('index.html', series(html));
    done();
}

exports.watch_files = watch_files;
exports.default = series(parallel(js, series(less_css, css)), html);
exports.server = server;