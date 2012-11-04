/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

CvPlsHelper.chrome.ContentSettingsDataAccessor = function(settingsDataStore, defaultSettings) {

  'use strict';

  var self = this;

  function storeSettings(settingsObject) {
    var key;
    for (key in settingsObject) {
      if (typeof settingsObject[key] !== "function") {
        if (typeof settingsObject[key] === "object") {
          settingsDataStore.saveSetting(key, JSON.stringify(settingsObject[key]));
        } else {
          settingsDataStore.saveSetting(key, settingsObject[key]);
        }
      }
    }
  }
  function normalizeSetting(value, defaultValue) {
    var result;

    if (value == undefined || value === null) {
      return defaultValue;
    }

    switch (typeof defaultValue) {
      case 'string':
        result = String(value);
        break;

      case 'boolean':
        result = Boolean(value && value !== "false");
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

  this.saveSetting = function(key, value) {
    chrome.extension.sendMessage({
      method: 'saveSetting',
      key: key,
      value: value
    });
    settingsDataStore.saveSetting(key, value);
  };

  this.getSetting = function(key) {
    if (defaultSettings[key] !== undefined) {
      return normalizeSetting(settingsDataStore.getSetting(key), defaultSettings[key]);
    }
    return null;
  };

  this.getAllSettings = function() {
    var key, result = {};
    for (key in defaultSettings) {
      if (typeof defaultSettings[key] !== 'function') {
        result[key] = self.getSetting(key);
      }
    }
    return result;
  };

  this.init = function(callBack) {
    chrome.extension.sendMessage({method: 'getAllSettings'}, function(settingsObject) {
      storeSettings(settingsObject);
      callBack();
    });
  };

};