'use strict';

// Requires
const gulp           = require('gulp');
const serve          = require('browser-sync').create();
const sass           = require('gulp-sass');
const sourcemaps     = require('gulp-sourcemaps');
const autoprefixer   = require('gulp-autoprefixer');
const useref         = require('gulp-useref');
const uglify         = require('gulp-uglify');
const babel          = require('gulp-babel');
const eslint         = require('gulp-eslint');
const gulpIf         = require('gulp-if');
const header         = require('gulp-header');
const htmlclean      = require('gulp-htmlclean');
const imagemin       = require('gulp-imagemin');
const cache          = require('gulp-cache');
const pipes          = require('gulp-pipes');
const nunjucksRender = require('gulp-nunjucks-render');
const data           = require('gulp-data');
const rename         = require('gulp-rename');
const del            = require('del');
const run            = require('run-sequence');
const pkg            = require('./package.json');
const path           = require('path');
const swPrecache     = require('sw-precache');
const inline         = require('gulp-inline-source');
const htmlbeautify   = require('gulp-html-beautify');
const html5Lint      = require('gulp-html5-lint');
const size           = require('gulp-size');
const rootDir        = 'app';
const distDir        = 'dist';

const AUTOPREFIXER_BROWSERS = [
		'ie >= 10',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	];

const year = new Date().getFullYear();
const banner = ' v<%= pkg.version %> | (c)'+ year +' , <%= pkg.company %> */\n';

const paths = {
		// Development.
		src_sass__shell   : 'app/scss/app_shell/',
		src_sass__content : 'app/scss/app_content/',
		src_js            : 'app/js/',
		src_pages         : 'app/pages/',
		src_templates     : 'app/templates/',
		// Destination.
		dest_css          : 'app/css/',
		dest_js           : 'app/js/'
	};

// Preventing Sass errors from breaking gulp watch
function errorHandler(err){
	console.log(err.toString());
	this.emit('end');
}

gulp.task('serve', () => {
	serve.init({
		proxy : 'https://paisidevs.local',
		port  : 3000,
		https : true,
		open  : false
	});
});

gulp.task('sass-shell', () => {
	return gulp.src(paths.src_sass__shell + 'app-shell.scss')
			   .pipe(sass({outputStyle:'expanded'}).on('error',errorHandler))
			   .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
			   .pipe(header('/* app-shell.css' + banner, { pkg : pkg } ))
			   .pipe(size({ showFiles: true }))
			   .pipe(gulp.dest(paths.dest_css))
			   .pipe(serve.stream())
});

gulp.task('sass-content', () => {
	return gulp.src(paths.src_sass__content + 'app-content.scss')
		       .pipe(sass({outputStyle:'expanded'}).on('error',errorHandler))
		       .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		       .pipe(header('/* app-content.css' + banner, { pkg : pkg } ))
		       .pipe(size({ showFiles: true }))
		       .pipe(gulp.dest(paths.dest_css))
	           .pipe(serve.stream())
});

gulp.task('useref', () =>
	gulp.src(['app/*.+(html|txt|json)','app/.htaccess','app/sitemap.xml'])
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.js', header('/* app.js' + banner, { pkg : pkg } )))
        .pipe(gulp.dest(distDir))
);

gulp.task('useref:root', () =>
	gulp.src(['app/*.+(html|txt|json)','app/.htaccess','app/sitemap.xml'])
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.js', header('/* app.js' + banner, { pkg : pkg } )))
        .pipe(gulp.dest(rootDir))
);

gulp.task('babel', () => {
	gulp.src('app/js/__dev/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(paths.src_js));
	
	// reload browser(s)
	serve.reload();
});

gulp.task('babel-concepts', () => {
	gulp.src('app/js/__dev/concepts/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(`${paths.src_js}/concepts/`));
	
	// reload browser(s)
	serve.reload();
});

gulp.task('images', () => {
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({ progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('nunjucks', () => {
	nunjucksRender.nunjucks.configure(['app/templates/'], {watch: false});

	// Gets .html and .nunjucks files in pages
	return gulp.src('app/pages/**/*.nunjucks')
				// Adding data to Nunjucks
			    .pipe(gulpIf('muvizone.nunjucks', data(() => {
			      return require('./app/__server/json/muvizone-db.json')
			    })))
				// Renders template with nunjucks
				.pipe(nunjucksRender().on('error',errorHandler))
				// output files in app folder
				.pipe(size({ showFiles: true }))
				.pipe(gulp.dest(rootDir))
				.pipe(serve.stream());
});

gulp.task('htmlbeautify', () => {
	return gulp.src(`${rootDir}/*.html`)
				.pipe(htmlbeautify({ indentSize : 2 }))
				.pipe(gulp.dest(`${rootDir}`))
});

gulp.task('html5-lint', () => {
    return gulp.src(`${rootDir}/*.html`)
        .pipe(html5Lint());
});

gulp.task('html', () => 
	gulp.src(`${distDir}/*.html`)
	    .pipe(htmlclean({
	        protect : /<\!--%fooTemplate\b.*?%-->/g,
	        edit    : function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
		}))
	    .pipe(gulp.dest(distDir))
);

gulp.task('gzip', function() {
    gulp.src(`${distDir}/js/*.js`)
	.pipe(gzip())
	.pipe(gulp.dest(`${distDir}/js/`))

	gulp.src(`${distDir}/css/*.css`)
		.pipe(gzip())
		.pipe(gulp.dest(`${distDir}/css/`))
});

gulp.task('inline', () => {
    return gulp.src(`${rootDir}/*.html`)
        .pipe(inline())
        .pipe(gulp.dest(`${rootDir}`));
});

gulp.task('fonts', () => 
	gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
);

gulp.task('generate-html', (cb) => {
	run('nunjucks',['htmlbeautify'], 'inline', cb);
});

gulp.task('clean', (cb) => {
	del('dist');
	return cache.clearAll(cb);
});

gulp.task('copy', () => {
	gulp.src([`${rootDir}/js/libs/modernizr.js`])
		.pipe(gulp.dest(`${distDir}/js/libs`))

	gulp.src([
			`${rootDir}/js/utils/sw-toolbox/companion.js`,
			`${rootDir}/js/utils/sw-toolbox/sw-toolbox.js`,
			`${rootDir}/js/utils/sw-toolbox/sw-toolbox-config.js`
	    ])
	    .pipe(gulp.dest(`${distDir}/js/utils/sw-toolbox`))
});

gulp.task('watch', () => {
	//
	gulp.watch(
		`${paths.src_sass__shell}/**/*.scss`   
		, ['sass-shell', 'generate-html', serve.reload]
	);
	//
	gulp.watch(
		`${paths.src_sass__content}/**/*.scss` 
		, ['sass-content']
	);
	//
	gulp.watch(
		[
			`${paths.src_templates}/**/*.nunjucks`,
			`${paths.src_pages}/**/*.nunjucks` 
		]    
		, ['generate-html']
	);
	//
	gulp.watch(
		`${paths.src_js}/__dev/*.js`                
		, ['babel']
	);
	//
	gulp.watch(
		`${paths.src_js}/__dev/concepts/**/*.js`                
		, ['babel-concepts']
	);
	//
	gulp.watch(
		`${paths.src_js}/utils/sw-toolbox/sw-toolbox-config.js`                
		, ['generate-sw']
	);
});

gulp.task('default', (cb) => {
	run(['serve', 'sass-shell', 'sass-content', 'generate-html', 'watch'], cb);
});

gulp.task('build', (cb) => {
	run('clean', 'sass-shell', 'sass-content', ['useref', 'images', 'fonts', 'copy'], 'html', 'generate-sw--build', cb);
});

gulp.task('generate-sw', (cb) => {
	swPrecache.write(path.join(rootDir, 'service-worker.js'), {
		cacheId : pkg.name || 'sublime-starter-kit',
		importScripts : [
			`/js/utils/sw-toolbox/sw-toolbox.js`,
			`/js/utils/sw-toolbox/sw-toolbox-config.js`
		],
		staticFileGlobs: [
			`${rootDir}/css/**/*.css`,
			`${rootDir}/fonts/**/*`,
			`${rootDir}/images/**/*`,
			`${rootDir}/js/**/*.js`,
			`${rootDir}/*.{html,json}`
		],
		navigateFallback: '/index.html',
		stripPrefix : rootDir
	}, cb);
});

gulp.task('generate-sw--build', (cb) => {
	swPrecache.write(path.join(distDir, 'service-worker.js'), {
		cacheId : pkg.name || 'sublime-starter-kit',
		importScripts : [
			`/js/utils/sw-toolbox/sw-toolbox.js`,
			`/js/utils/sw-toolbox/sw-toolbox-config.js`
		],
		staticFileGlobs: [
			`${distDir}/css/app.css`,
			`${distDir}/fonts/**/*`,
			`${distDir}/images/**/*`,
			`${distDir}/js/**/*.js`,
			`${distDir}/*.{html,json}`
		],
		navigateFallback: '/index.html',
		stripPrefix : distDir
	}, cb);
});