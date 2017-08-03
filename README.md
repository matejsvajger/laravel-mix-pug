# laravel-mix-pug
Laravel Mix Plugin for compiling Pug/Jade templates.

<p align="center">
<a href="https://www.npmjs.com/package/laravel-mix-pug"><img src="https://img.shields.io/npm/v/laravel-mix-pug.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-mix-pug"><img src="https://img.shields.io/npm/dt/laravel-mix-pug.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-mix-pug"><img src="https://img.shields.io/npm/l/laravel-mix-pug.svg" alt="NPM"></a>
</p>

## Introduction

This package provides a plugin for Laravel Mix to compile pug templates. `laravel-mix-pug` requires Laravel Mix to work. Please follow the instructions on how to use it on the package [repository](https://github.com/JeffreyWay/laravel-mix).

## Usage

Install this package into your project:

```
npm install laravel-mix-pug --save-dev
```
Head over to your `webpack.mix.js` and register it on the Laravel Mix API:

```js
let mix = require('laravel-mix');
mix.pug = require('laravel-mix-pug');

mix.js('src/app.js', 'dist')
   .sass('src/app.scss', 'dist')
   .pug('src/*.pug', 'dist')
   .setPublicPath('dist');
```

## Options
You can also pass in a third optional parameter: *options* object. It accepts two options:

### seeds
This is a path to a folder with seed files. Files can be of type `json` or `yaml`. They will be parsed and provided in your pug template locals under the seed file name and then contents.

```js
mix.pug('src/*.pug', 'dist', {seeds:'src/seeds'});
```

And if you have a file `demo.yml` in there all the content will be available in your template under

```pug
a(href=seed.demo.anchor.link) seed.demo.anchor.name
```

### locals
It's possible to pass in an object which will be added to locals in your pug templates:

```js
mix.pug('src/*.pug', 'dist', {
    locals: {
        config: { baseUrl: 'http://my-template.dev/' }
    }
});
```

and in your pug file:

```pug
link(rel="stylesheet" media="screen" href=`{config.baseUrl}css/app.css`)
script(src=`{config.baseUrl}js/main.js`)
```


## License

Laravel Mix Pug is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).