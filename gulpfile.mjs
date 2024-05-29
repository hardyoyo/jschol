// ##### Gulp Toolkit for the jschol app #####

// TODO: refactor to use ESM , instead of CommonJS

import _ from 'lodash';
import gulp from 'gulp';
import gutil from 'gulp-util';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import assets from 'postcss-assets';
import livereload from 'gulp-livereload';
import { exec, spawn } from 'child_process';
import webpack from 'webpack';

// Instantiate gulp-sass with the Dart Sass compiler
const sass = gulpSass(dartSass);

// Process control for Sinatra
let sinatraProc;// Main app in Sinatra (Ruby)

const productionMode = !!gutil.env.production


// Dynamically import the Webpack configuration file based on productionMode
import('./webpack.' + (productionMode? 'prd' : 'dev') + '.js')
 .then((config) => {
    config.watch = true; // Set watch to true in the configuration
    webpack(config, function(error, stats) {
      if (error) {
        gutil.log('[webpack]', error);
      }
      showSummary(stats);
      livereload.reload();
    });
    done();
  })
 .catch((error) => {
    console.error("Failed to load Webpack configuration:", error);
    done();
  });


function showSummary(stats) {
    gutil.log('[webpack]', stats.toString({
        colors: gutil.colors.supportsColor,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    }));
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// read package.json and get dependencies' package ids
function getNPMPackageIds() {
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Process Sass to CSS, add sourcemaps, autoprefix CSS selectors, optionally Base64 font and 
// image files into CSS, and reload browser:
gulp.task('sass', function(done) {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      flexbox: ['no-2009'],
      grid: false // don't prefix any properties from old grid spec since not all new grid properties correlate with old grid spec still used by IE
    }))
    .pipe(postcss([assets({
      loadPaths: ['fonts/', 'images/']
    })]))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('app/css'))
    .pipe(livereload())
    .on('end', done);
})

///////////////////////////////////////////////////////////////////////////////////////////////////
// Support functions for starting and restarting Sinatra (server for the main Ruby app)
function startSinatra(afterFunc)
{
  // Sometimes Puma doesn't die even when old gulp does. Explicitly kill it off.
  exec('pkill -9 -f ^puma.*'+process.env.PUMA_PORT, (err, stdout, stderr) => { })
  setTimeout(()=>{
    // Now spawn a new sinatra/puma process
    sinatraProc = spawn('bin/puma', { stdio: 'inherit' })
    sinatraProc.on('exit', function(code) {
      sinatraProc = null
    })
  }, 500)
}

function restartSinatra(done)
{
  if (sinatraProc) {
    console.log("Restarting Sinatra.")
    sinatraProc.kill('SIGUSR1')
  }
  else {
    startSinatra()
  }
  console.log("restart sinatra complete.")
  done()
}

gulp.task('start-sinatra', restartSinatra)

///////////////////////////////////////////////////////////////////////////////////////////////////
// Watch sass, html, and js and reload browser if any changes

gulp.task('watch', function(done) {
  gulp.watch('app/scss/*.scss', {interval:500}, gulp.parallel(['sass']));
  // WARNING: if you are experiencing a Sinatra reload loop in Lando, comment
  // out the next watch line, OR close any Ruby files you might have open, and
  // re-open them after you boot up Lando
  gulp.watch(['app/*.rb', 'util/*.rb'], {interval:500, usePolling: true}, restartSinatra)
  // signal completion
  done()
});


///////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('livereload', function(done) {
  livereload.listen();
  done()
});


gulp.task('maybe-socks', function(done) {
  var socksProc = spawn('ruby', ['tools/maybeSocks.rb'], { stdio: 'inherit' })
  done()
});


///////////////////////////////////////////////////////////////////////////////////////////////////
// Build everything in order, then start the servers and watch for incremental changes.
if (productionMode) {
  gulp.task('default',  gulp.parallel(['watch', 'start-sinatra', 'sass']))
} else {
  gulp.task('default', gulp.parallel(['watch', 'start-sinatra',
                        'maybe-socks', 'livereload', 'sass']))
}
