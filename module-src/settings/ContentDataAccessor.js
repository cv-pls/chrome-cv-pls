/*jslint plusplus: true, white: true, browser: true */
/*global ContentDataAccessor, chrome */

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
                    this.dataStore.saveSetting(key, JSON.stringify(settingsObject[key]));
                } else {
                    this.dataStore.saveSetting(key, settingsObject[key]);
                }
            }
        }
    }

    /**
     * Constructor
     *
     * @param {DataStore}       dataStore       Object which stores the settings
     * @param {DefaultSettings} defaultSettings Map of the default settings
     */
    ContentDataAccessor = function(dataStore, defaultSettings)
    {
        this.dataStore = dataStore;
        this.defaultSettings = defaultSettings;
    };

    /**
     * @param {DataStore} Object which stores the settings
     */
    ContentDataAccessor.prototype.dataStore = null;

    /**
     * @param {DefaultSettings} Map of the default settings
     */
    ContentDataAccessor.prototype.defaultSettings = null;

    /**
     * Save a setting in the data store
     *
     * @param {string} key   The setting name
     * @param {mixed}  value The setting value
     */
    ContentDataAccessor.prototype.saveSetting = function(key, value)
    {
        chrome.extension.sendMessage({
            method: 'saveSetting',
            key: key,
            value: value
        });

        this.dataStore.saveSetting(key, value);
    };

    /**
     * Retrieve a setting from the data store
     *
     * @param {string} key   The setting name
     *
     * @return {mixed} The setting value
     */
    ContentDataAccessor.prototype.getSetting = function(key)
    {
        if (this.defaultSettings[key] !== undefined) {
            return normalizeSetting(this.dataStore.getSetting(key), this.defaultSettings[key]);
        }

        return null;
    };

    /**
     * Retrieve all settings from the data store
     *
     * @return {object} The settings as a map
     */
    ContentDataAccessor.prototype.getAllSettings = function()
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
    ContentDataAccessor.prototype.init = function(callBack)
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
