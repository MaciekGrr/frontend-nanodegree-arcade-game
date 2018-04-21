const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync'),
      useref = require('gulp-useref'),
      uglify = require('gulp-uglify'),
      gulpIf = require('gulp-if'),
      cssnano = require('gulp-cssnano'),
      image = require("gulp-image"),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      responsive = require("gulp-responsive"),
      $ = require("gulp-load-plugins")(),
      cache = require('gulp-cache'),
      del = require('del'),
      runSequence = require('run-sequence'),
      autoprefixer = require('gulp-autoprefixer'),
      eslint = require('gulp-eslint'),
      babel = require('gulp-babel'),
      sourcemaps = require('gulp-sourcemaps');


// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

// sass
gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in src/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe   (autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('src/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// eslint
gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['config.paths.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
 
gulp.task('default', ['lint'], function () {
    // This will only run if the lint task is successful...
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']).on("change", browserSync.reload);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

// Responsive images
gulp.task("images:responsive", function(){
    return gulp.src(["src/images/*.{png,jpg}"])
    .pipe($.responsive({
        // resize all JPGs to different resolutions
        "*.jpg": [{
                width: 300, 
                rename: {suffix: "-300px"},
            },
            {
                width: 500, 
                rename: {suffix: "-500px"},
            },
            {
                width: 650, 
                rename: {suffix: "-650px"},
            },
            {
                // compress, strip metadata and rename original image
                rename: {suffix: "-original"},
            }
        ],
        // resize all PNG to be retina ready
        "*.png": [
            {
                width: 250,
            },
            {
                width: 250*2,
                rename: {suffix: "@2x"},
            }
        ],
    }, {
        // Global configuration for all images
        // The output quality for JPEG, Webp and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        widthMetadata: false,
    }))
    .pipe(gulp.dest("src/images/responsive"));
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(gulpIf('./js/**/*.js', uglify()))
    .pipe(gulpIf('./css/**/*.css', cssnano()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('docs'));
});

// Optimizing Images 
gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('docs/images'))
});

// Compress Images
gulp.task("images:compress", function () {
    gulp.src("images_src/**/*.*")
    .pipe(image({
        jpegRecompress: ['--strip', '--quality', 'medium', '--min', 6, '--max', 8],
        jpegoptim: false,
        mozjpeg: false,
        concurrent: 10,
    }))
    .pipe(gulp.dest("images_src/compressed2"));
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('docs/fonts'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('docs').then(function(cb) {
    return cache.clearAll(cb);
  });
})

//gulp.task('clean:docs', function() {
//  return del.sync(['docs/**/*', 'docs/images', 
//       'docs/images/**/*']);
//});

// Build Sequences
// ---------------

// Build development version
gulp.task('default', function(callback) {
  runSequence(['sass', 'lint', 'browserSync'], 'watch',
    callback
  )
});



// Build production version
gulp.task('build', function(callback) {
  runSequence('clean', 'sass', ['useref', 'images:minify', 'fonts'],
    callback
  )
});