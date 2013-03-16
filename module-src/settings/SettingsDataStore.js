/*jslint plusplus: true, white: true, browser: true */
/*global localStorage */

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
