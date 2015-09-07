var fs = require('fs');
var path = require('path');
var minimatch = require('minimatch');

var webpack = require('webpack');
var Format = require('./format');

/**
 根据manifest-revision-webpack-plugin该写的生产assets => assets-hash的映射manifest。
 https://github.com/nickjj/manifest-revision-webpack-plugin
 */

/**
 * Produce a much slimmer version of webpack stats containing only information
 * that you would be interested in when creating an asset manifest.

 * @param {string} output - The output file path.
 * @param {object} options - Options to configure this plugin.
 */
var ManifestRevisionPlugin = function (output, options) {
    this.output = output;
    this.options = options;

    // Set sane defaults for any options.
    this.options.rootAssetPath = options.rootAssetPath || './';
    this.options.format = options.format || 'general';

    var includePaths = [];
    var paths = options.includePaths || [];
    for (var i = 0; i < paths.length; ++i) {
        includePaths.push(
            './' + path.join(this.options.rootAssetPath, paths[i]));
    }
    this.options.includePaths = includePaths;
};

/**
 * When given a logical asset path, produce an array that contains the logical
 * path of the asset without the cache hash included as the first element.
 * The second element contains the cached version of the asset name.

 * @param {string} logicalAssetPath - The path of the asset without the root.
 * @param {string} cachedAsset - The file name of the asset with the cache hash.
 * @returns {Array}
 */
ManifestRevisionPlugin.prototype.mapAsset = function (logicalAssetPath, cachedAsset) {
    if (logicalAssetPath.charAt(0) === '/') {
        logicalAssetPath = logicalAssetPath.substr(1);
    }

    return [logicalAssetPath, cachedAsset];
};

/**
 * Take in the modules array from the webpack stats and produce an object that
 * only includes assets that matter to us. The key is the asset logical path
 * and the value is the logical path but with the cached asset name.
 *
 * You would use this as a lookup table in your web server.

 * @param {string} data - Array of webpack modules.
 * @returns {Object}
 */
ManifestRevisionPlugin.prototype.parsedAssets = function (data) {
    var assets = {};

    for (var i = 0, length = data.length; i < length; i++) {
        var item = data[i];

        // 只处理本地的assets.
        if (item.name.indexOf('./') === 0 &&
            item.name.indexOf('~/') === -1 &&
            fs.lstatSync(item.name).isFile() &&
            item.hasOwnProperty('assets') &&
            item.assets.length > 0) {

            var included = false;

            for (var j = 0; j < this.options.includePaths.length; j++) {
                if (minimatch(item.name, this.options.includePaths[j])) {
                    included = true;
                    break;
                }
            }

            if (included) {
                var nameWithoutRoot = item.name.replace(
                    this.options.rootAssetPath + '/', '');
                var mappedAsset = this.mapAsset(nameWithoutRoot,
                    item.assets.slice(-1)[0]);
                assets[mappedAsset[0]] = mappedAsset[1];
            }
        }
    }

    return assets;
};

ManifestRevisionPlugin.prototype.apply = function (compiler) {
    var self = this;
    var output = this.output;

    // Micro optimize toJson by eliminating all of the data we do not need.
    var options = {};
    options.assets = true;
    options.version = false;
    options.timings = false;
    options.chunks = true;
    options.chunkModules = false;
    options.cached = true;
    options.source = false;
    options.reasons = false;
    options.errorDetails = false;
    options.chunkOrigins = false;

    compiler.plugin('done', function (stats) {
        var data = stats.toJson(options);
        var parsedAssets = self.parsedAssets(data.modules);
        var outputData = null;

        if (typeof self.options.format === 'string' ||
            self.options.format instanceof String) {

            var format = new Format(data, parsedAssets);
            outputData = format[self.options.format]();
        }
        else {
            outputData = self.options.format(data, parsedAssets);
        }

        fs.writeFileSync(output, JSON.stringify(outputData, null, '\t'));
    });
};

module.exports = ManifestRevisionPlugin;
