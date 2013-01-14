/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

window.addEventListener('DOMContentLoaded', function() {

  "use strict";

  var pluginSettings, settingsManager, popUpMenu;

  pluginSettings = (new CvPlsHelper.chrome.ModuleLoader()).loadModule('settings', CvPlsHelper.DefaultSettings);

  settingsManager = new CvPlsHelper.chrome.SettingsManager(pluginSettings);

  popUpMenu = new CvPlsHelper.chrome.PopUpMenu();

});