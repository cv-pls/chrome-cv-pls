/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

  "use strict";

  var application, opts, onInit;

  opts = {
    SettingsDataAccessor: CvPlsHelper.chrome.ContentSettingsDataAccessor,
    SettingsDataStore: CvPlsHelper.chrome.SettingsDataStore,
    DefaultSettings: CvPlsHelper.chrome.DefaultSettings,
    DesktopNotificationDispatcher: CvPlsHelper.chrome.DesktopNotificationDispatcher
  };

  onInit = function() {
    // Show update page
    chrome.extension.sendMessage({method: 'checkUpdate'});

    // Add address bar icon
    if (pluginSettings.getSetting('showIcon')) {
      chrome.extension.sendMessage({method: 'showIcon'});
    }
  };

  application = CvPlsHelper.ChatApplication(document, opts, onInit);
  application.start();

}());