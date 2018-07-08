'use strict';

let gulp        = require('gulp'),
    eslint      = require('gulp-eslint'),
    rollup      = require('rollup').rollup;

let cache;

function copyDependencies() {
    return gulp
        .src([
            './node_modules/three/build/three.js'
        ])
        .pipe(gulp.dest('./dist/'))
}

function build() {
    return rollup({
        input: 'src/js/main.js',
        cache: cache,
        external: [
            'three'
        ]
    }).then(function(bundle) {
        return bundle.write({
            file:  'dist/main.js',
            sourcemap: true,
            format: 'iife',
            globals: {
                three: 'THREE'
                // add your globals if you have some
            },
        });
    });
}

function lint() {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
}

export default gulp.series(
    copyDependencies,
    build,
    lint
);
