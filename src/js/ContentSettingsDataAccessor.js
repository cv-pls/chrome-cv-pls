/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

  'use strict';

  function storeSettings(settingsObject) {
    var key;
    for (key in settingsObject) {
      if (typeof settingsObject[key] !== 'function') {
        if (typeof settingsObject[key] === 'object') {
          this.settingsDataStore.saveSetting(key, JSON.stringify(settingsObject[key]));
        } else {
          this.settingsDataStore.saveSetting(key, settingsObject[key]);
        }
      }
    }
  }
  function normalizeSetting(value, defaultValue) {
    var result;

    if (value === undefined || value === null) {
      return defaultValue;
    }

    switch (typeof defaultValue) {
      case 'string':
        result = String(value);
        break;

      case 'boolean':
        result = Boolean(value && value !== 'false');
        break;

      case 'number':
        result = Number(value);
        if (isNaN(result)) {
          result = defaultValue;
        }
        break;

      case 'object':
        if (typeof value === 'object') {
          result = value;
        } else if (typeof value === 'string') {
          try {
            result = JSON.parse(value);
          } catch (e) {
            result = defaultValue;
          }
        } else {
          result = defaultValue;
        }
        break;

    }

    return result;
  }

  CvPlsHelper.chrome.ContentSettingsDataAccessor = function(settingsDataStore, defaultSettings) {
    this.settingsDataStore = settingsDataStore;
    this.defaultSettings = defaultSettings;
  };

  CvPlsHelper.chrome.ContentSettingsDataAccessor.prototype.saveSetting = function(key, value) {
    chrome.extension.sendMessage({
      method: 'saveSetting',
      key: key,
      value: value
    });
    this.settingsDataStore.saveSetting(key, value);
  };

  CvPlsHelper.chrome.ContentSettingsDataAccessor.prototype.getSetting = function(key) {
    if (this.defaultSettings[key] !== undefined) {
      return normalizeSetting(this.settingsDataStore.getSetting(key), this.defaultSettings[key]);
    }
    return null;
  };

  CvPlsHelper.chrome.ContentSettingsDataAccessor.prototype.getAllSettings = function() {
    var key, result = {};
    for (key in this.defaultSettings) {
      if (typeof this.defaultSettings[key] !== 'function') {
        result[key] = this.getSetting(key);
      }
    }
    return result;
  };

  CvPlsHelper.chrome.ContentSettingsDataAccessor.prototype.init = function(callBack) {
    var self = this;
    chrome.extension.sendMessage({method: 'getAllSettings'}, function(settingsObject) {
      storeSettings.call(self, settingsObject);
      callBack();
    });
  };

}());