/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, localStorage */

CvPlsHelper.chrome.SettingsDataStore = function() {

  "use strict";

  this.getSetting = function(key) {
    return localStorage.getItem(key);
  };

  this.saveSetting = function(key, value) {
    localStorage.setItem(key, value);
  };

  this.deleteSetting = function(key) {
    localStorage.remove(key);
  };

  this.truncate = function() {
    localStorage.clear();
  };

};