/// <binding AfterBuild='bundle-and-minify' />
/// <reference types="./gulpfile" />

import gulp = require('gulp');
import concat = require('gulp-concat');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import del = require('del');

const _cleanupTaskNames: string[] = [];
const _cssTaskNames: string[] = [];
const _jsTaskNames: string[] = [];


const _buildConfig: BuildConfigDTO = require('./gulpfileBuildConfig.json'); // this will tell us which configuration we're in i.e Debug or Release
const _bundleConfig: BundleConfigDTO = require('./gulpfileBundleConfig.json'); // this will hold the bundles

const _bundleAndMinify: boolean = _bundleConfig.BundleAndMinifyInDebug || !_buildConfig.BuildConfig.startsWith("Debug");

if (_bundleAndMinify) {

    for (let i = 0; i < _bundleConfig.Bundles.length; i++) {
        const bundle = _bundleConfig.Bundles[i];

        if (bundle.CssFiles && bundle.CssFiles.length > 0) {
            createCssTask(bundle.Name, bundle.CssFiles);
        }

        if (bundle.JsFiles && bundle.JsFiles.length > 0) {
            createJsTask(bundle.Name, bundle.JsFiles);
        }
    }
}

gulp.task('bundle-and-minify', (cb) => {
    if (_bundleAndMinify) {
        return gulp.series(_cleanupTaskNames, _cssTaskNames, _jsTaskNames)(cb);
    }
    else {
        return cb();
    }
});


/*
    CSS
*/

function createCssTask(bundleName: string, files: string[]) {
    const destFileName = `${bundleName}.min.css`;
    gulp.task(destFileName, () => {
        return gulp.src(files)
            .pipe(concat(destFileName))
            .pipe(cleanCss())
            .pipe(gulp.dest(_bundleConfig.DestFolder));
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

function createJsTask(bundleName: string, files: string[]) {
    const destFileName = `${bundleName}.min.js`;
    gulp.task(destFileName, () => {
        return gulp.src(files)
            .pipe(concat(destFileName))
            .pipe(uglify())
            .pipe(gulp.dest(_bundleConfig.DestFolder));
    });
    _jsTaskNames.push(destFileName);

    const cleanupTaskName = `${destFileName}.cleanup`;
    gulp.task(cleanupTaskName, () => {
        return del(destFileName);
    });
    _cleanupTaskNames.push(cleanupTaskName);
}