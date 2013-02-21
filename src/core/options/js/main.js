/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

window.addEventListener('DOMContentLoaded', function() {

  "use strict";

  var pluginSettings, settingsForm, settingsControlManager;

  pluginSettings = (new CvPlsHelper.chrome.ModuleLoader()).loadModule('settings', CvPlsHelper.DefaultSettings);

  settingsControlManager = new CvPlsHelper.chrome.SettingsControlManager(pluginSettings);
  settingsForm = new CvPlsHelper.chrome.SettingsForm(settingsControlManager);

  settingsForm.init();

});