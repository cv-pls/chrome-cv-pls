/*jslint plusplus: true, white: true, browser: true, sloppy: true */
/*global DataStore:true, localStorage */

/**
 * Allows access to settings from the background script
 */
(function() {
    /**
     * Constructor
     */
    DataStore = function() {};

    /**
     * Retrieve a setting from localStorage
     *
     * @param {string} key The setting name
     *
     * @return {mixed} The setting value
     */
    DataStore.prototype.getSetting = function(key)
    {
        return localStorage.getItem(key);
    };

    /**
     * Save a setting in localStorage
     *
     * @param {string} key   The setting name
     * @param {mixed}  value The setting value
     */
    DataStore.prototype.saveSetting = function(key, value)
    {
        localStorage.setItem(key, value);
    };
}());
