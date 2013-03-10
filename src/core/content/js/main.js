/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {
  var moduleLoader = new CvPlsHelper.chrome.ModuleLoader();

  moduleLoader.loadModule('settings', CvPlsHelper.DefaultSettings).init(function() {
    (new CvPlsHelper.ChatApplication(document, moduleLoader)).start();

    chrome.extension.sendMessage({method: 'checkUpdate'});
    if (this.getSetting('showIcon')) {
      chrome.extension.sendMessage({method: 'showIcon'});
    }
  });
}());