/* Extraemos dependencias */
const { src, dest, watch, series, parallel} = require('gulp');

/* CSS Y SASS */
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss'); /* Esta dependencia nos ayuda a hacer nuestro codigo compatible con todos los navegadores */
const autoprefixer = require('autoprefixer');/* Esta dependencia nos ayuda a hacer nuestro codigo compatible con todos los navegadores */
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');


/* Imagenes */
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const { version } = require('os');

function css(done) {

    // Compilar sass
    // pasos 1 - identificar archivo, 2- compilar, 3-Guardar el .css
    /* src Funcion de gulp que nos permite identificar archivo 
        dest funcion que nos permite guardar en .css
    pipe nos permite ejecutar otra tarea antes de terminar la funcion*/
    src('src/scss/app.scss') /* identifica */
        .pipe( sourcemaps.init()) /* Inicializa sourcemaps */
        .pipe( sass() ) /* copila */ /*.pipe( sass({ outputStyle: 'compressed'}) )  outputStyle nos agrega un modo de copilar el codigo visualmente al momento de guardar en el archivo .css */
        .pipe( postcss ( [ autoprefixer(), cssnano() ]) )  /* Hace compatible nuestro codigo con todos los navegadores */
        .pipe (sourcemaps.write('.'))
        .pipe( dest('build/css')) /* guarda en build/css */

        done();
}
function imagenes (){
    return src('src/img/**/*') //identifica
    .pipe(imagemin( {optimizationLevel: 3 }))
    .pipe(dest('build/img')) //guarda en build/css
}

function versionWebp(){
    return src('src/img/**/*.{png,jpg}')/* Filtrar ambos formatos png y jpg */
        .pipe(webp())
        .pipe(dest('build/img'))
}

function versionAvif(){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe ( dest('build/img'));
}

function dev(){
    watch('src/scss/**/*.scss', css) /* Busca cualquier carpeta y archivos con extension con .scss  */
    watch('src/img/**/*', imagenes) /* Si se agregan o se quitan imagenes se actualizan */
   
    /* mira cambios en 'src/scss/app.scss' y ejecuta la funcion css*/
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes,  versionWebp, versionAvif, css, dev)

/* Series - ejecuta una primer tarea y hasta que finaliza, inicia la siguiente
parallel - todas inician al mismo tiempo*/