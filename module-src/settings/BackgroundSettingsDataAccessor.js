/*jslint plusplus: true, white: true, browser: true */

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
