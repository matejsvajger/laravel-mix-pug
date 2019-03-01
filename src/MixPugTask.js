const FileCollection = require('laravel-mix/src/FileCollection');
const File = require('laravel-mix/src/File');
const Task = require('laravel-mix/src/tasks/Task');
const PugSeeder = require('./PugSeeder');

const notifier = require('node-notifier');
const glob = require('glob');
const path = require('path');
const pug  = require('pug');
const fs   = require('fs');

class MixPugTask extends Task {

    /**
     * Run the pug compiler.
     */
    run() {

        let {files, dest, options} = this.data;

        if (!options) {
            options = {
                seeds: null,
                locals: {},
                pug: null,
                ext: '.html',
                excludePath: null
            };
        }
        
        // Set destination folder
        this.dest = dest;

        // Set pug options
        this.pugOptions = options.pug;

        // Setup template seeder
        this.seedPath = options.seeds;
        this.locals = options.locals || {};
        this.extension = options.ext || '.html';
        this.excludePath = options.excludePath || null;

        this.seeder = this.createSeeder();

        // Prepare Template Files
        this.templates = files;

        // We'll be watching for changes on all pug files
        // in case a layout, mixin or partial changes and
        // all seed files included.
        this.files = new FileCollection(
            glob.sync('**/*.pug', {ignore: 'node_modules/**/*'}).concat(
                this.seeder.files
            )
        );

        // Preprare destination assets
        this.assets = files.map(asset => this.prepareAssets(asset));

        this.compile();
    }


    /**
     * Compiles a collection of Pug templates.
     *
     */
    compile() {

        this.templates.forEach((template, index) => this.compileTemplate(template, index));

        return this;
    }

    /**
     * Compiles a single pug template
     * 
     * @param {string} src Path to the pug source file
     * @param {number} index
     */
    compileTemplate(src, index) {
        let file = new File(src);
        let output = this.assets[index];

        try {
        
            let template = pug.compileFile(file.path(), this.pugOptions);

            let html = template(
                this.seeder.locals
            );
        
            fs.writeFileSync(output.path(), html);

            this.onSuccess();

        } catch (e) {
            this.onFail(e.name + ': ' + e.message);
        }
    }

    /**
     * Updates seeder with changed data files
     * 
     */
    createSeeder() {
        return new PugSeeder(this.seedPath)
            .extend(this.locals);
    }

    /**
     * Recompile on change when using watch
     * 
     * @param {string} updatedFile 
     */
    onChange(updatedFile) {
        this.seeder = this.createSeeder();
        this.compile();
    }


    /**
     * Handle successful compilation.
     *
     * @param {string} output
     */
    onSuccess(output) {
        if (Config.notifications.onSuccess) {
            notifier.notify({
                title: 'Laravel Mix',
                message: 'Pug Compilation Successful',
                contentImage: 'node_modules/laravel-mix-pug/src/logo.png'
            });
        }
    }


    /**
     * Handle failed compilation.
     *
     * @param {string} output
     */
    onFail(output) {
        console.log("\n");
        console.log('Pug Compilation Failed!');
        console.log();
        console.log(output);

        if (Mix.isUsing('notifications')) {
            notifier.notify({
                title: 'Laravel Mix',
                subtitle: 'Pug Compilation Failed',
                message: output,
                contentImage: 'node_modules/laravel-mix-pug/src/logo.png'
            });
        }
    }

    relativePathFromSource(filePath, excludePath) {
         excludePath = excludePath || 'resources/assets/pug';
         return filePath.split(excludePath).pop();
    }

    prepareAssets(src) {
        let file = new File(src);
        let pathFromBase = this.relativePathFromSource(file.base(), this.excludePath);
        let baseDir = path.join(pathFromBase, this.dest);

        if (!File.exists(baseDir)) {
            new File(baseDir).makeDirectories();
        }

        let output = path.join(baseDir, file.nameWithoutExtension() + this.extension);
        let asset = new File(output);

        return asset;
    }

}

module.exports = MixPugTask;
