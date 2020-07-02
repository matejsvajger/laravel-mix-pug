let Verify, Assert;
// laravel-mix@1.x
try { Verify = require('laravel-mix/src/Verify'); }
// laravel-mix@>=2.x
catch (e) { Assert = require('laravel-mix/src/Assert'); }

const notifier = require('node-notifier');
const glob = require('glob');

function pug(src, dest, options) {

    // laravel-mix@1.x
    if (Verify != null) Verify.dependency('pug', ['pug'], true);
    // laravel-mix@>=2.x
    else Assert.dependencies(['pug'], true);

    let globOption = options.glob ? options.glob : {}
    let files = glob.sync(src, globOption);

    let MixPugTask = require('./MixPugTask');

    Mix.addTask(new MixPugTask({
        files, dest, options
    }));

    return this;
}

module.exports = pug;
