const fs = require('fs');
const _ = require('lodash');
const glob = require('glob');
const yaml = require('js-yaml');
const foldero = require('foldero');

class PugSeeder {

    constructor(path) {

        this.path = path;
        this.files = glob.sync(path + '/**/*.+(json|yaml|yml)');
        this.locals = {
            seed: this.parse(path)
        };
    }

    /**
     * Parses all json|yaml files in the seed folder
     * and assigns them to locals object.
     * 
     * @param {string} seedPath Path to directory with seed files
     */
    parse(seedPath) {
        if (fs.existsSync(seedPath)) {
            return foldero(seedPath, {
                recurse: true,
                whitelist: '(.*/)*.+\.(json|ya?ml)$',
                loader: file => this.parseFile(file)
            });
        } 
    }

    /**
     * Parses a single seed file and
     * returns a representative object.
     * 
     * @param {string} file path to seed file for parsing
     */
    parseFile(file) {
        let json = {};

        try {
            json = (path.extname(file).match(/^.ya?ml$/)) ?
                yaml.safeLoad(fs.readFileSync(file, 'utf8')):
                JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch(e) {
            console.log(`Error Parsing DATA file: ${file}\n`);
            console.log('==== Details Below ====' + `\n${e.message}`);

            if (Mix.isUsing('notifications')) {
                notifier.notify({
                    title: 'Laravel Mix',
                    subtitle: 'Pug Compilation Failed',
                    message: e.message,
                    contentImage: 'node_modules/laravel-mix-pug/src/logo.png'
                });
            }
        }

        return json;
    }

    /**
     * Extends locals object with passed in object
     * 
     * @param {object} data 
     */
    extend(data) {
        this.locals = _.extend(this.locals, data);
        return this;
    }

}

module.exports = PugSeeder;