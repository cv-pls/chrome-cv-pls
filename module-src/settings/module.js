/*jslint plusplus: true, white: true, browser: true, sloppy: true */
/*global 
    CvPlsHelper, chrome,
    makeDefaultSettingsObject:false, 
    BackgroundDataAccessor, ContentDataAccessor, DataStore, DefaultSettings
*/

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
