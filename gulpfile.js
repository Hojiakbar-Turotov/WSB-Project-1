const { src, dest, watch, parallel, series } = require("gulp");
const pug = require("gulp-pug");
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const cssbeautify = require("gulp-cssbeautify");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify-es").default;
const image = require("gulp-imagemin");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const plumber = require("gulp-plumber");
const browsersync = require("browser-sync").create();

const path = {
  build: {
    html: "./",
    css: "./public/css",
    js: "./public/js",
    img: "./public/images",
    font: "./public/fonts",
  },
  src: {
    html: "./src/pug/index.pug",
    css: "./src/assets/scss/main.scss",
    js: "./src/assets/js/*.js",
    img: "./src/assets/images/**/*.{jpg,png,svg,jfif,jpeg,webp,gif}",
    font: "./src/assets/fonts/**/*.{ttf,woff,woff2,svg}",
  },
  watch: {
    html: "./src/pug/**/*.pug",
    css: "./src/assets/scss/**/*.scss",
    js: "./src/assets/js/**/*.js",
    img: "./src/assets/images/**/*.{jpg,png,svg,jfif,jpeg,webp,gif}",
    font: "./src/assets/fonts/**/*.{ttf,woff,woff2,svg}",
  },
  clean: "./public",
};

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./",
    },
    port: 2007,
  });
}

function cleanDist() {
  return src(path.clean).pipe(clean({ read: false }));
}

async function html() {
  return src(path.src.html, { base: "./src/pug/" })
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

async function css() {
  return src(path.src.css, { base: "./src/assets/scss" })
    .pipe(plumber())
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min", extname: ".css" }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

async function js() {
  return src(path.src.js, { base: "./src/assets/js/" })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify({ compress: true }))
    .pipe(rename({ suffix: ".min", extname: ".js" }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

async function img() {
  return src(path.src.img)
    .pipe(image())
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

async function font() {
  return src(path.src.font, { base: "./src/assets/fonts" })
    .pipe(dest(path.build.font))
    .pipe(browsersync.stream());
}

async function watchFiles() {
  watch([path.watch.html], html);
  watch([path.watch.css], css);
  watch([path.watch.js], js);
  watch([path.watch.img], img);
  watch([path.watch.font], font);
}

const build = parallel(html, css, js, img, font);
const watcher = series(cleanDist, build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.font = font;
exports.watcher = watcher;
exports.default = watcher;
