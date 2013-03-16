/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome, DataStore, ContentDataAccessor, BackgroundDataAccessor */

/**
 * Module definition
 */
CvPlsHelper.modules.settings = {
    load: function(args) {
        var appSettings = args[0];
        if (chrome.tabs === undefined) {
            return new ContentDataAccessor(new DataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
        }
        return new BackgroundDataAccessor(new DataStore(), makeDefaultSettingsObject(DefaultSettings, appSettings));
    }
};
