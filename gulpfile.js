let project_folder = "dist";
let source_folder = "#src";
let fs = require('fs');

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        carousel: project_folder + "/carousel/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        jq: source_folder + "/js/**/*.min.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
        carousel: source_folder + "/carousel/**/*",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        carousel: source_folder + "/carousel/**/*.{css,scss,sass,less,js}",
    },
    clean: "./" + project_folder + "/"
}

let {src, dest} = require('gulp'),
gulp = require('gulp'),
browsersync = require("browser-sync").create(),
fileinclude = require("gulp-file-include"),
del = require("del"),
scss = require("gulp-sass"),
scss_carousel = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
groupmedia = require("gulp-group-css-media-queries"),
cleancss = require("gulp-clean-css"),
rename = require("gulp-rename"),
uglify = require("gulp-uglify-es").default,
imagemin = require("gulp-imagemin"),
webp = require("gulp-webp"),
webphtml = require("gulp-webp-html"),
webphcss = require("gulp-webp-css"),
svgsprite = require("gulp-svg-sprite"),
ttf2woff = require("gulp-ttf2woff"),
ttf2woff2 = require("gulp-ttf2woff2"),
fonter = require("gulp-fonter");

function browserSync(params){
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: true
    })
}
function html(){
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}
function css(){
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(groupmedia())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: true
    }))
    // .pipe(webphcss())
    .pipe(dest(path.build.css))
    .pipe(cleancss())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
function js(){
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
function jq(){
    return src(path.src.jq)
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
function carousel(){
    return src(path.src.carousel)
    .pipe(dest(path.build.carousel))
    .pipe(browsersync.stream())
}
function watchFiles(params){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
    gulp.watch([path.watch.carousel], carousel)
}
function images(){
    return src(path.src.img)
    .pipe(
        webp({
            quality: 70
        })
        )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
        imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5, // 0 to 7
            svgoPlugins: [{removeViewBox: true}]
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}
function clean(params){
    return del(path.clean);
}
function fonts(params){
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}
function fontStyle(params){
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == ''){
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function(err, items) {
            if(items){
                let c_fontname;
                for (var i = 0; i<items.length; i++){
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname){
                        fs.appendFile(source_folder + '/scss/fonts.scss', 
                        '@include font("'+ fontname +'", "'+ fontname+'", 400, normal); \r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}
function cb(){

}

gulp.task('svgsprite', function(){
    return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svgsprite({
        mode: {
            stack: {
                sprite: "../icons/icons.svg",
                example: true
            }
        }
    }))
    .pipe(dest(path.build.img))
})
gulp.task('otf2ttf', function(){
    return src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'))
})

let build = gulp.series(clean, gulp.parallel(jq, js, css, carousel, html, images, fonts), fontStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fontStyle = fontStyle;
exports.fonts = fonts;
exports.images = images;
exports.jq = jq;
exports.js = js;
exports.css = css;
exports.carousel = carousel;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;