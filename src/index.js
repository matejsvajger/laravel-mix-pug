const Verify = require('laravel-mix/src/Verify');
const notifier = require('node-notifier');
const glob = require('glob');

function pug(src, dest, options) {

    Verify.dependency('pug', ['pug'], true);
        
    let files = glob.sync(src);

    let MixPugTask = require('./MixPugTask');

    // Changes to temporarily avoid the problem
    // that this plugin can not be used with laravel-mix@>=4.0.0
    // https://github.com/matejsvajger/laravel-mix-pug/issues/9
    if (Mix.addAsset == null) {

        // Alternative to Config.customAssets
        // https://github.com/JeffreyWay/laravel-mix/blob/v3/src/config.js#L20
        const configCustomAssets = [];

        // Re-enable addAsset method for this plugin
        // https://github.com/JeffreyWay/laravel-mix/blob/v3/src/Mix.js#L79
        Mix.addAsset = function(asset) {
            configCustomAssets.push(asset);
        };

        // Re-enable processing to add customAssets to manifest
        // https://github.com/JeffreyWay/laravel-mix/blob/v3/src/Manifest.js#L66
        const Manifest = Object.getPrototypeOf(Mix.manifest);
        Manifest.transform = function(stats) {
            let customAssets = configCustomAssets.map(asset =>
                asset.pathFromPublic()
            );
            this.flattenAssets(stats)
                .concat(customAssets)
                .forEach(this.add.bind(this));
            return this;
        };
    }

    Mix.addTask(new MixPugTask({ 
        files, dest, options 
    }));

    return this;
 }

 module.exports = pug;
