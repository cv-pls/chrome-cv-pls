/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

window.addEventListener('DOMContentLoaded', function() {

  "use strict";

  var pluginSettings, dupeSettingsManager, settingsManager;

  pluginSettings = new CvPlsHelper.chrome.BackgroundSettingsDataAccessor(new CvPlsHelper.chrome.SettingsDataStore(), CvPlsHelper.chrome.DefaultSettings);

  dupeSettingsManager = new CvPlsHelper.chrome.DupeSettingsManager(pluginSettings);
  settingsManager = new CvPlsHelper.chrome.SettingsManager(pluginSettings, dupeSettingsManager);

});