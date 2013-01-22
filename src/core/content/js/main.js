/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(new CvPlsHelper.ChatApplication(document, new CvPlsHelper.chrome.ModuleLoader())).start(function(pluginSettings) {
  chrome.extension.sendMessage({method: 'checkUpdate'});
  if (pluginSettings.getSetting('showIcon')) {
    chrome.extension.sendMessage({method: 'showIcon'});
  }
});