const { src, dest, parallel, series, watch } = require('gulp');

const del = require('del');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');

const bs = browserSync.create();

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html',
    },
    {
      name: 'Features',
      link: 'features.html',
    },
    {
      name: 'About',
      link: 'about.html',
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce',
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme',
        },
        {
          name: 'divider',
        },
        {
          name: 'About',
          link: 'https://github.com/zce',
        },
      ],
    },
  ],
  pkg: require('./package.json'),
  date: new Date(),
};

const clean = () => {
  return del(['temp', 'dist']);
};

// SCSS ----> CSS
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass())
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
// js
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};
// 页面
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }));
};

const image = () => {
  return src('src/assets/images/*', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
};

const font = () => {
  return src('src/assets/fonts/*', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'));
};

const extra = () => {
  return src('public/**', { base: 'public' }).pipe(dest('dist'));
};

const serve = () => {
  watch('src/assets/styles/*.scss', style);
  watch('src/assets/scripts/*.js', script);
  watch('src/*.html', page);
  // 开发时不监听图片字体，提高开发时编译效率
  // watch('src/assets/images/*', image);
  // watch('src/assets/fonts/', font);
  // watch('public/**', extra);
  watch(['src/assets/images/*', 'src/assets/fonts/', 'public/**'], bs.reload);
  bs.init({
    port: '8080', //端口
    // open: false, //默认是否打开浏览器
    // watch: true,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      },
      // files: 'dist/**',
    },
  });
};

// 引用创建第三方
const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest('dist'));
};

const compile = parallel(style, script, page);

const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const dev = series(compile, serve);

module.exports = { clean, build, dev };
