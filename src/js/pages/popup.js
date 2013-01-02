/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

window.addEventListener('DOMContentLoaded', function() {

  "use strict";

  var pluginSettings, settingsManager, popUpMenu;

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

  pluginSettings = new CvPlsHelper.chrome.BackgroundSettingsDataAccessor(new CvPlsHelper.chrome.SettingsDataStore(), makeDefaultSettingsObject(CvPlsHelper.chrome.DefaultSettings));

  settingsManager = new CvPlsHelper.chrome.SettingsManager(pluginSettings);

  popUpMenu = new CvPlsHelper.chrome.PopUpMenu();

});