/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

  'use strict';

  var pluginSettings, desktopNotification;

  function makeDefaultSettingsObject(overrides) {
    var key, result = {};
    overrides = overrides || {};

    for (key in CvPlsHelper.DefaultSettings) {
      if (CvPlsHelper.DefaultSettings.hasOwnProperty(key)) {
        result[key] = CvPlsHelper.DefaultSettings[key];
      }
    }

    for (key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        result[key] = overrides[key];
      }
    }

    return result;
  }

  function messageListener(request, sender, callBack) {
    var currentVersion, currentSavedVersion,
        response = {};

    switch(request.method) {

      // Init procedures
      case 'checkUpdate':
        currentVersion = chrome.app.getDetails().version;
        currentSavedVersion = pluginSettings.getSetting('currentSavedVersion');

        if (currentSavedVersion === null || currentVersion !== currentSavedVersion) {
          pluginSettings.saveSetting('currentSavedVersion', currentVersion);
          chrome.tabs.create({ url: chrome.extension.getURL('html/update.html') });
        }
        break;

      case 'getAllSettings':
        response = pluginSettings.getAllSettings();
        break;

      case 'saveSetting':
        pluginSettings.saveSetting(request.key, request.value);
        break;

      // Actions
      case 'showIcon':
        chrome.pageAction.show(sender.tab.id);
        break;

      case 'showNotification':
        desktopNotification.buildNotification(request.title, request.message);
        desktopNotification.show();
        break;
    }

    if (typeof callBack === 'function') {
      callBack(response);
    }
  }

  pluginSettings = new CvPlsHelper.chrome.BackgroundSettingsDataAccessor(new CvPlsHelper.chrome.SettingsDataStore(), makeDefaultSettingsObject(CvPlsHelper.chrome.DefaultSettings));

  desktopNotification = new CvPlsHelper.chrome.DesktopNotificationManager();

  chrome.extension.onMessage.addListener(messageListener);

}());