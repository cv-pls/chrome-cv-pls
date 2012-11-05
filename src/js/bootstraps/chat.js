/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(new CvPlsHelper.ChatApplication(document, {
  SettingsDataAccessor: CvPlsHelper.chrome.ContentSettingsDataAccessor,
  SettingsDataStore: CvPlsHelper.chrome.SettingsDataStore,
  DefaultSettings: CvPlsHelper.chrome.DefaultSettings,
  DesktopNotificationDispatcher: CvPlsHelper.chrome.DesktopNotificationDispatcher
}, function(pluginSettings) {
  chrome.extension.sendMessage({method: 'checkUpdate'});
  if (pluginSettings.getSetting('showIcon')) {
    chrome.extension.sendMessage({method: 'showIcon'});
  }
})).start();