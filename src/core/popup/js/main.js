/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

window.addEventListener('DOMContentLoaded', function() {

  "use strict";

  var pluginSettings, popUpMenu;

  pluginSettings = (new CvPlsHelper.chrome.ModuleLoader()).loadModule('settings', CvPlsHelper.DefaultSettings);

  popUpMenu = new CvPlsHelper.chrome.PopUpMenu();

});