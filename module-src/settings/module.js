/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

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
