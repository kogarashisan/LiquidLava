
var files = require('./build/files');
var files_list = files.core.concat(files.parsers).concat(files.data).concat(files.classes).concat(files.widgets);
for (var i = 0, count = files_list.length; i < count; i++) {
    files_list[i] = 'src/' + files_list[i];
}

files_list = [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
    'lib/export/firestorm.js'
].concat(files_list).concat([
    {pattern: 'locale/*', included: true},
    'test/*.js'
]);

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        frameworks: ['mocha', 'chai-spies', 'chai' /*, 'browserify'*/],
        //plugins: ['karma-mocha', 'karma-browserify', 'karma-coverage', 'karma-chai', 'karma-chrome-launcher'],
        // list of files / patterns to load in the browser
        files: files_list,
        // list of files to exclude
        exclude: [
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*': 'coverage'
            //'test/**/*.spec.js': 'browserify'
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'/*, 'Firefox', 'PhantomJS', 'IE', 'Safari'*/],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        coverageReporter: { type : 'html', dir : 'coverage/' }
    })
};