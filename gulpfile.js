const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const swig = require('gulp-swig');
const imagemin = require('gulp-imagemin');

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

// SCSS ----> CSS
const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass())
    .pipe(dest('dist'));
};
// js
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'));
};
// 页面
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(swig({ data }))
    .pipe(dest('dist'));
};

const image = () => {
  return src('src/assets/images/*', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'));
};

const compile = parallel([style, script, page, image]);

module.exports = { compile, style, script, page, image };
