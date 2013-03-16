/*jslint plusplus: true, white: true, browser: true */
/*global chrome */

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
