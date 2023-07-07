/// <binding AfterBuild='default' />
/// <reference types="./gulpfile" />

import gulp = require('gulp');
import concat = require('gulp-concat');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import del = require('del');

const _cleanupTaskNames: string[] = [];
const _cssTaskNames: string[] = [];
const _jsTaskNames: string[] = [];


/*
    Read gulpfileBuildConfig.json - this will tell us which configuration we're in i.e Debug or Release
    Read gulpfileBundleConfig.json - this will hold the bundles
*/

const _gulpfileBuildConfig: BuildConfigDTO = require('./gulpfileBuildConfig.json');
const _gulpfileBundleConfig: BundleConfigDTO = require('./gulpfileBundleConfig.json');

const _isDebug: boolean = _gulpfileBuildConfig.BuildConfig.startsWith("Debug");
const _bundleAndMinify: boolean = !_isDebug || _gulpfileBundleConfig.BundleAndMinifyInDebug;

if (_bundleAndMinify) {

    for (let i = 0; i < _gulpfileBundleConfig.Bundles.length; i++) {
        const bundle = _gulpfileBundleConfig.Bundles[i];

        if (bundle.CssSourceFiles && bundle.CssSourceFiles.length > 0) {
            createCssTask(bundle.BundleName, bundle.CssSourceFiles);
        }

        if (bundle.JsSourceFiles && bundle.JsSourceFiles.length > 0) {
            createJsTask(bundle.BundleName, bundle.JsSourceFiles);
        }
    }
}


/*
    CSS
*/

function createCssTask(bundleName: string, sourceFiles: string[]) {
    const destFileName = `${bundleName}.min.css`;
    gulp.task(destFileName, () => {
        return gulp.src(sourceFiles)
            .pipe(concat(destFileName))
            .pipe(cleanCss())
            .pipe(gulp.dest(_gulpfileBundleConfig.DestFolder));
    });
    _cssTaskNames.push(destFileName);

    const cleanupTaskName = `${destFileName}.cleanup`;
    gulp.task(cleanupTaskName, () => {
        return del(destFileName);
    });
    _cleanupTaskNames.push(cleanupTaskName);
}


/*
    JAVASCRIPT
*/

function createJsTask(bundleName: string, sourceFiles: string[]) {
    const destFileName = `${bundleName}.min.js`;
    gulp.task(destFileName, () => {
        return gulp.src(sourceFiles)
            .pipe(concat(destFileName))
            .pipe(uglify())
            .pipe(gulp.dest(_gulpfileBundleConfig.DestFolder));
    });
    _jsTaskNames.push(destFileName);

    const cleanupTaskName = `${destFileName}.cleanup`;
    gulp.task(cleanupTaskName, () => {
        return del(destFileName);
    });
    _cleanupTaskNames.push(cleanupTaskName);
}


/*
    GULP
*/

gulp.task('session-start', (cb) => {
    if (_bundleAndMinify) {
        return gulp.series(_cleanupTaskNames, _cssTaskNames, _jsTaskNames)(cb);
    }
});

gulp.task('default', gulp.series('session-start'));