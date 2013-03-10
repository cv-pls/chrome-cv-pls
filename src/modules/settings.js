/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome, localStorage */

(function() {

  'use strict';

  // Constructors
  var ContentSettingsDataAccessor, BackgroundSettingsDataAccessor, SettingsDataStore, DefaultSettings;

  // Helper functions
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
  function makeDefaultSettingsObject(defaults, overrides) {
    var key, result = {};
    overrides = overrides || {};

    for (key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        result[key] = defaults[key];
      }
    }

    for (key in overrides) {
      if (overrides.hasOwnProperty(key)) {
        result[key] = overrides[key];
      }
    }

    result.currentSavedVersion = '0.0.0'; // internal use, force value

    return result;
  }

  // Module definition
  CvPlsHelper.modules.settings = {
    load: function(args) {
      var appSettings = args[0];
      if (chrome.tabs === undefined) {
        return new ContentSettingsDataAccessor(new SettingsDataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
      }
      return new BackgroundSettingsDataAccessor(new SettingsDataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
    }
  };

  DefaultSettings = {
    showIcon: true
  };

  (function() { // ContentSettingsDataAccessor

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

    ContentSettingsDataAccessor = function(settingsDataStore, defaultSettings) {
      this.settingsDataStore = settingsDataStore;
      this.defaultSettings = defaultSettings;
    };

    ContentSettingsDataAccessor.prototype.saveSetting = function(key, value) {
      chrome.extension.sendMessage({
        method: 'saveSetting',
        key: key,
        value: value
      });
      this.settingsDataStore.saveSetting(key, value);
    };

    ContentSettingsDataAccessor.prototype.getSetting = function(key) {
      if (this.defaultSettings[key] !== undefined) {
        return normalizeSetting(this.settingsDataStore.getSetting(key), this.defaultSettings[key]);
      }
      return null;
    };

    ContentSettingsDataAccessor.prototype.getAllSettings = function() {
      var key, result = {};
      for (key in this.defaultSettings) {
        if (typeof this.defaultSettings[key] !== 'function') {
          result[key] = this.getSetting(key);
        }
      }
      return result;
    };

    ContentSettingsDataAccessor.prototype.init = function(callBack) {
      var self = this;
      chrome.extension.sendMessage({method: 'getAllSettings'}, function(settingsObject) {
        storeSettings.call(self, settingsObject);
        callBack.call(self);
      });
    };

  }());

  (function() { // BackgroundSettingsDataAccessor

    BackgroundSettingsDataAccessor = function(settingsDataStore, defaultSettings) {
      this.settingsDataStore = settingsDataStore;
      this.defaultSettings = defaultSettings;
    };

    BackgroundSettingsDataAccessor.prototype.saveSetting = function(key, value) {
      this.settingsDataStore.saveSetting(key, value);
    };

    BackgroundSettingsDataAccessor.prototype.getSetting = function(key) {
      if (this.defaultSettings[key] !== undefined) {
        return normalizeSetting(this.settingsDataStore.getSetting(key), this.defaultSettings[key]);
      }
      return null;
    };

    BackgroundSettingsDataAccessor.prototype.getAllSettings = function() {
      var key, result = {};
      for (key in this.defaultSettings) {
        if (typeof this.defaultSettings[key] !== 'function') {
          result[key] = this.getSetting(key);
        }
      }
      return result;
    };

    BackgroundSettingsDataAccessor.prototype.init = function(callBack) {
      callBack();
    };

  }());

  (function() { // SettingsDataStore

    SettingsDataStore = function() {};

    SettingsDataStore.prototype.getSetting = function(key) {
      return localStorage.getItem(key);
    };

    SettingsDataStore.prototype.saveSetting = function(key, value) {
      localStorage.setItem(key, value);
    };

    SettingsDataStore.prototype.deleteSetting = function(key) {
      localStorage.remove(key);
    };

    SettingsDataStore.prototype.truncate = function() {
      localStorage.clear();
    };

  }());

}());