/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

(function() {

  CvPlsHelper.chrome.ModuleLoader = function() {};

  CvPlsHelper.chrome.ModuleLoader.prototype.loadModule = function(moduleName) {
    var i, args = [];

    moduleName = moduleName.toLowerCase();
    if (CvPlsHelper.modules[moduleName] === undefined) {
      throw new Error('The specified module ('+moduleName+') could not be found, it may not be supported on this platform');
    }

    for (i = 1; arguments[i] !== undefined; i++) {
      args.push(arguments[i]);
    }

    return CvPlsHelper.modules[moduleName].load(args);
  };

}());