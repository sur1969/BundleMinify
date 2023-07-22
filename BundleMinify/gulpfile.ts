/// <binding AfterBuild='bundle-and-minify' />
/// <reference types="./gulpfile" />

import gulp = require('gulp');
import concat = require('gulp-concat');
import uglify = require('gulp-uglify');
import cleanCss = require('gulp-clean-css');
import del = require('del');

const _cleanupTasks: string[] = [];
const _cssTasks: string[] = [];
const _jsTasks: string[] = [];


const _buildConfig: BuildConfigDTO = require('./gulpfileBuildConfig.json'); // this will tell us which configuration we're in i.e Debug or Release
const _bundleConfig: BundleConfigDTO = require('./gulpfileBundleConfig.json'); // this will hold the bundles
const _bundleAndMinify: boolean = _bundleConfig.BundleConfigs.indexOf(_buildConfig.BuildConfig) > -1;


gulp.task('bundle-and-minify', (cb) => {
    if (_bundleAndMinify) {
        createCleanupTask();

        for (let i = 0; i < _bundleConfig.Bundles.length; i++) {
            const bundle = _bundleConfig.Bundles[i];

            if (bundle.CssFiles && bundle.CssFiles.length > 0) {
                createCssTask(bundle.Name, bundle.CssFiles);
            }

            if (bundle.JsFiles && bundle.JsFiles.length > 0) {
                createJsTask(bundle.Name, bundle.JsFiles);
            }
        }

        return gulp.series(_cleanupTasks, _cssTasks, _jsTasks)(cb);
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
            .pipe(gulp.dest(_bundleConfig.BundleFolder));
    });
    _cssTasks.push(destFileName);
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
            .pipe(gulp.dest(_bundleConfig.BundleFolder));
    });
    _jsTasks.push(destFileName);
}


/*
    Utilities
*/

function createCleanupTask() {
    const taskName = "cleanup task";
    gulp.task(taskName, () => {
        return del(_bundleConfig.BundleFolder);
    });
    _cleanupTasks.push(taskName);
}