let Verify, Dependencies;
// laravel-mix@1.x
try { Verify = require('laravel-mix/src/Verify'); }
// laravel-mix@>=2.x
catch (e) { Dependencies = require('laravel-mix/src/Dependencies'); }

const notifier = require('node-notifier');
const glob = require('glob');

function pug(src, dest, options = {}) {

    // laravel-mix@1.x
    if (Verify != null) Verify.dependency('pug', ['pug'], true);
    // laravel-mix@>=2.x
    else new Dependencies(['pug']).install(true);

    let globOption = options.glob ? options.glob : {}
    let files = glob.sync(src, globOption);

    let MixPugTask = require('./MixPugTask');

    Mix.addTask(new MixPugTask({
        files, dest, options
    }));

    return this;
}

module.exports = pug;
