// gulpfile.js
'use strict'
const gulp = require('gulp')
const templateCache = require('gulp-angular-templatecache')
const minifyHtml = require('gulp-minify-html')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ngannotate = require('gulp-ng-annotate')
const closure = require('gulp-jsclosure')
const p = require('path')
const md5 = require('gulp-md5')
const filesize = require('gulp-filesize')
const gutil = require('gulp-util')
const clean = require('gulp-clean')
const runSequence = require('run-sequence')
var dest = "./app/dist/";



/**
* Paths configuration, easy to change and/or use in multiple tasks
*/
const paths = {
	
  thirdparty: [
    './app/assets/third-party/jquery.min.js',
    './app/assets/third-party/angular.min.js',
    './app/assets/third-party/angular-ui-router.min.js',
    './app/assets/third-party/angular-sanitize.js',
    './app/assets/third-party/angular-touch.min.js',
    './app/assets/third-party/angular-animate.js',
    './app/assets/third-party/lodash.min.js',
    './app/assets/third-party/highlight.min.js',
    './app/assets/third-party/angular-highlightjs.js',
    './app/assets/third-party/ui-bootstrap-tpls.js',
    './app/assets/third-party/angularjs-dropdown-multiselect.js',
    './app/assets/third-party/highcharts.src.js',
    './app/assets/third-party/highcharts-ng.min.js',
    './app/assets/third-party/highcharts-3d.js',
    './app/assets/third-party/exporting.js',
    './app/assets/third-party/highcharts.js'	
  ],

  appcommon: [
    './app/app-services/*.js'
  ],
  
  appmainscript: [
    './app/app.js',
    './app/components/**/*.js'
  ],
  templates: [
    './app/components/**/*.html'
  ]
}

var _uglifyConfig = {
  compress: true
};

/**
* Takes html templates and transform them to angular templates (javascript)
*/
gulp.task('templates', function() {
  return gulp.src(paths.templates)
   .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(templateCache({
      module: 'myModule.templates',
      standalone: true,
      /**
       * Here, I'm removing .html so that `$templateCache` holds
       * the template in `views/home` instead of `views/home.html`.
       * I'm keeping the directory structure for the template's name
       */
      transformUrl: function(url) {
        return url.replace(p.extname(url), '')
      }
    }))
    //put all those to our javascript file
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./src/js'))
})


gulp.task('clean-all', function () {  
  return gulp.src(dest, {read: false})
    .pipe(clean());
});


gulp.task('compress-thirdparty', function() {  
  return gulp.src(paths.thirdparty)
    .pipe(concat('tp.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .pipe(uglify(_uglifyConfig))
    .pipe(rename('tp.min.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .on('error', gutil.log)
});


gulp.task('compress-appcommon',['compress-thirdparty'], function() {  
  return gulp.src(paths.appcommon)
    .pipe(concat('core.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .pipe(uglify(_uglifyConfig))
    .pipe(rename('core.min.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .on('error', gutil.log)
});


gulp.task('compress-appmainscript',['compress-appcommon'], function() {  
  return gulp.src(paths.appmainscript)
    .pipe(concat('main.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .pipe(uglify(_uglifyConfig))
    .pipe(rename('main.min.js'))
    //.pipe(md5(10))
    .pipe(gulp.dest('./app/dist'))
    .pipe(filesize())
    .on('error', gutil.log)
});


/**
* Concat, closure, annotate, uglify scripts
* @beforeDo `gulp templates`
*/
gulp.task('thirdparty',function() {
  return gulp.src(paths.thirdparty)
    //first, I'm building a clean 'main.js' file
    .pipe(concat('tp.js'))
    .pipe(closure({angular: true}))
    .pipe(ngannotate())
    .pipe(gulp.dest('./app/dist'))
    //then, uglify the `main.js` and rename it to `main.min.js`
    //mangling might cause issues with angular
    .pipe(uglify({mangle: false}))
    .pipe(rename('tp.min.js'))
    .pipe(gulp.dest('./app/dist'))
})

/**
* Concat, closure, annotate, uglify scripts
* @beforeDo `gulp templates`
*/
gulp.task('appcommon',['thirdparty'],function() {
  return gulp.src(paths.appcommon)
    //first, I'm building a clean 'main.js' file
    .pipe(concat('core.js'))
    .pipe(closure({angular: true}))
    .pipe(ngannotate())
    .pipe(gulp.dest('./app/dist'))
    //then, uglify the `main.js` and rename it to `main.min.js`
    //mangling might cause issues with angular
    .pipe(uglify({mangle: false}))
    .pipe(rename('core.min.js'))
    .pipe(gulp.dest('./app/dist'))
})

/**
* Concat, closure, annotate, uglify scripts
* @beforeDo `gulp templates`
*/
gulp.task('appmainscript', ['appcommon'], function() {
  return gulp.src(paths.appmainscript)
    //first, I'm building a clean 'main.js' file
    .pipe(concat('main.js'))
    .pipe(closure({angular: true}))
    .pipe(ngannotate())
    .pipe(gulp.dest('./app/dist'))
    //then, uglify the `main.js` and rename it to `main.min.js`
    //mangling might cause issues with angular
    .pipe(uglify({mangle: false}))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./app/dist'))
})

/**
* The command `gulp` will resolve in `gulp scripts`
*/
//gulp.task('default', ['compress-appmainscript'])

gulp.task('default', function(cb) {
    runSequence('clean-all', 'compress-appmainscript', cb);
});

/**
* Watch the paths you want and execute the scripts task
* @beforeDo default (small useful hack)
*/
gulp.task('watch', ['default'], function() {
  /**
   * Either don't add `templates.js` to the js paths 
   * and add it later to the scripts task source or remove it here.
   * Indeed, if `templates.js` is beeing watched, 
   * it'll run the templates task and it might change the file. 
   * The task will then run again, etc.
   * You can use https://github.com/urish/gulp-add-src to add it to the `script`
   * sources.
   */
  let js = paths.javascripts.slice()
  gulp.watch(js, ['compress-appmainscript'])
})