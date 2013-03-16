/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome, localStorage */
/* Built with build-module.php at 2013-03-16 01:30:32 GMT */

(function() {

    'use strict';

    var BackgroundSettingsDataAccessor, ContentSettingsDataAccessor, DefaultSettings, SettingsDataStore;

    /**
     * Module definition
     */
    CvPlsHelper.modules.settings = {
        load: function(args) {
            var appSettings = args[0];
            if (chrome.tabs === undefined) {
                return new ContentSettingsDataAccessor(new SettingsDataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
            }
            return new BackgroundSettingsDataAccessor(new SettingsDataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
        }
    };

    /**
     * Normalize a setting to the correct type and value
     *
     * @param {mixed} value        The current value
     * @param {mixed} defaultValue The default value
     *
     * @return {mixed} The normalized setting
     */
    function normalizeSetting(value, defaultValue)
    {
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

    /**
     * Create a default settings object based on the default values and configured overrides
     *
     * @param {object} defaults The default settings object
     * @param {object} defaults The overridden settings object
     *
     * @return {object} The created object
     */
    function makeDefaultSettingsObject(defaults, overrides)
    {
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

        // internal use, force value
        result.currentSavedVersion = '0.0.0.0';

        return result;
    }

    /**
     * Allows access to settings from the background script
     */
    (function() {
        /**
         * Constructor
         *
         * @param {SettingsDataStore} settingsDataStore Object which stores the settings
         * @param {DefaultSettings}   defaultSettings   Map of the default settings
         */
        BackgroundSettingsDataAccessor = function(settingsDataStore, defaultSettings)
        {
            this.settingsDataStore = settingsDataStore;
            this.defaultSettings = defaultSettings;
        };

        /**
         * @param {SettingsDataStore} Object which stores the settings
         */
        ContentSettingsDataAccessor.prototype.settingsDataStore = null;

        /**
         * @param {DefaultSettings} Map of the default settings
         */
        ContentSettingsDataAccessor.prototype.defaultSettings = null;

        /**
         * Save a setting in the data store
         *
         * @param {string} key   The setting name
         * @param {mixed}  value The setting value
         */
        BackgroundSettingsDataAccessor.prototype.saveSetting = function(key, value)
        {
            this.settingsDataStore.saveSetting(key, value);
        };

        /**
         * Retrieve a setting from the data store
         *
         * @param {string} key   The setting name
         *
         * @return {mixed} The setting value
         */
        BackgroundSettingsDataAccessor.prototype.getSetting = function(key)
        {
            if (this.defaultSettings[key] !== undefined) {
                return normalizeSetting(this.settingsDataStore.getSetting(key), this.defaultSettings[key]);
            }

            return null;
        };

        /**
         * Retrieve all settings from the data store
         *
         * @return {object} The settings as a map
         */
        BackgroundSettingsDataAccessor.prototype.getAllSettings = function()
        {
            var key, result = {};

            for (key in this.defaultSettings) {
                if (typeof this.defaultSettings[key] !== 'function') {
                    result[key] = this.getSetting(key);
                }
            }

            return result;
        };

        /**
         * Initialize the settings values
         *
         * @param {function} callBack Callback function to execute when the settings are initialized
         */
        BackgroundSettingsDataAccessor.prototype.init = function(callBack)
        {
            callBack();
        };
    }());

    /**
     * Allows access to settings from content scripts
     */
    (function() {
        /**
         * Store a complete settings object in the data store
         */
        function storeSettings(settingsObject)
        {
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

        /**
         * Constructor
         *
         * @param {SettingsDataStore} settingsDataStore Object which stores the settings
         * @param {DefaultSettings}   defaultSettings   Map of the default settings
         */
        ContentSettingsDataAccessor = function(settingsDataStore, defaultSettings) {
            this.settingsDataStore = settingsDataStore;
            this.defaultSettings = defaultSettings;
        };

        /**
         * @param {SettingsDataStore} Object which stores the settings
         */
        ContentSettingsDataAccessor.prototype.settingsDataStore = null;

        /**
         * @param {DefaultSettings} Map of the default settings
         */
        ContentSettingsDataAccessor.prototype.defaultSettings = null;

        /**
         * Save a setting in the data store
         *
         * @param {string} key   The setting name
         * @param {mixed}  value The setting value
         */
        ContentSettingsDataAccessor.prototype.saveSetting = function(key, value)
        {
            chrome.extension.sendMessage({
                method: 'saveSetting',
                key: key,
                value: value
            });

            this.settingsDataStore.saveSetting(key, value);
        };

        /**
         * Retrieve a setting from the data store
         *
         * @param {string} key   The setting name
         *
         * @return {mixed} The setting value
         */
        ContentSettingsDataAccessor.prototype.getSetting = function(key)
        {
            if (this.defaultSettings[key] !== undefined) {
                return normalizeSetting(this.settingsDataStore.getSetting(key), this.defaultSettings[key]);
            }

            return null;
        };

        /**
         * Retrieve all settings from the data store
         *
         * @return {object} The settings as a map
         */
        ContentSettingsDataAccessor.prototype.getAllSettings = function()
        {
            var key, result = {};

            for (key in this.defaultSettings) {
                if (typeof this.defaultSettings[key] !== 'function') {
                    result[key] = this.getSetting(key);
                }
            }

            return result;
        };

        /**
         * Initialize the settings values
         *
         * @param {function} callBack Callback function to execute when the settings are initialized
         */
        ContentSettingsDataAccessor.prototype.init = function(callBack)
        {
            var self = this,
                message = {
                    method: 'getAllSettings'
                };

            chrome.extension.sendMessage(message, function(settingsObject) {
                storeSettings.call(self, settingsObject);
                callBack.call(self);
            });
        };
    }());

    /**
     * The default settings for the plugin
     */
    DefaultSettings = {
        showIcon: true
    };

    /**
     * Allows access to settings from the background script
     */
    (function() {
        /**
         * Constructor
         */
        SettingsDataStore = function() {};

        /**
         * Retrieve a setting from localStorage
         *
         * @param {string} key The setting name
         *
         * @return {mixed} The setting value
         */
        SettingsDataStore.prototype.getSetting = function(key)
        {
            return localStorage.getItem(key);
        };

        /**
         * Save a setting in localStorage
         *
         * @param {string} key   The setting name
         * @param {mixed}  value The setting value
         */
        SettingsDataStore.prototype.saveSetting = function(key, value)
        {
            localStorage.setItem(key, value);
        };

        /**
         * Remove a setting from localStorage
         *
         * @param {string} key   The setting name
         */
        SettingsDataStore.prototype.deleteSetting = function(key)
        {
            localStorage.remove(key);
        };

        /**
         * Empty the localStorage object
         */
        SettingsDataStore.prototype.truncate = function()
        {
          localStorage.clear();
        };
    }());

}());
