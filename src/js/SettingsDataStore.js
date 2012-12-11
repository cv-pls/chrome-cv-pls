/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, localStorage */

(function() {

  'use strict';

  CvPlsHelper.chrome.SettingsDataStore = function() {};

  CvPlsHelper.chrome.SettingsDataStore.prototype.getSetting = function(key) {
    return localStorage.getItem(key);
  };

  CvPlsHelper.chrome.SettingsDataStore.prototype.saveSetting = function(key, value) {
    localStorage.setItem(key, value);
  };

  CvPlsHelper.chrome.SettingsDataStore.prototype.deleteSetting = function(key) {
    localStorage.remove(key);
  };

  CvPlsHelper.chrome.SettingsDataStore.prototype.truncate = function() {
    localStorage.clear();
  };

}());