"use strict";
/// <binding AfterBuild='bundle-and-minify' />
/// <reference types="./gulpfile" />
Object.defineProperty(exports, "__esModule", { value: true });
var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCss = require("gulp-clean-css");
var del = require("del");
var _cleanupTaskNames = [];
var _cssTaskNames = [];
var _jsTaskNames = [];
var _buildConfig = require('./gulpfileBuildConfig.json'); // this will tell us which configuration we're in i.e Debug or Release
var _bundleConfig = require('./gulpfileBundleConfig.json'); // this will hold the bundles
var _bundleAndMinify = _bundleConfig.BundleConfigs.indexOf(_buildConfig.BuildConfig) > -1;
gulp.task('bundle-and-minify', function (cb) {
    if (_bundleAndMinify) {
        for (var i = 0; i < _bundleConfig.Bundles.length; i++) {
            var bundle = _bundleConfig.Bundles[i];
            if (bundle.CssFiles && bundle.CssFiles.length > 0) {
                createCssTask(bundle.Name, bundle.CssFiles);
            }
            if (bundle.JsFiles && bundle.JsFiles.length > 0) {
                createJsTask(bundle.Name, bundle.JsFiles);
            }
        }
        return gulp.series(_cleanupTaskNames, _cssTaskNames, _jsTaskNames)(cb);
    }
    else {
        return cb();
    }
});
/*
    CSS
*/
function createCssTask(bundleName, files) {
    var destFileName = bundleName + ".min.css";
    gulp.task(destFileName, function () {
        return gulp.src(files)
            .pipe(concat(destFileName))
            .pipe(cleanCss())
            .pipe(gulp.dest(_bundleConfig.BundleFolder));
    });
    _cssTaskNames.push(destFileName);
    var cleanupTaskName = destFileName + ".cleanup";
    gulp.task(cleanupTaskName, function () {
        return del(destFileName);
    });
    _cleanupTaskNames.push(cleanupTaskName);
}
/*
    JAVASCRIPT
*/
function createJsTask(bundleName, files) {
    var destFileName = bundleName + ".min.js";
    gulp.task(destFileName, function () {
        return gulp.src(files)
            .pipe(concat(destFileName))
            .pipe(uglify())
            .pipe(gulp.dest(_bundleConfig.BundleFolder));
    });
    _jsTaskNames.push(destFileName);
    var cleanupTaskName = destFileName + ".cleanup";
    gulp.task(cleanupTaskName, function () {
        return del(destFileName);
    });
    _cleanupTaskNames.push(cleanupTaskName);
}
//# sourceMappingURL=gulpfile.js.map