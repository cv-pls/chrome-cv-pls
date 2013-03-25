/*jslint plusplus: true, white: true, browser: true, sloppy: true */
/*global CvPlsHelper, DesktopNotificationDispatcher */

/**
 * Module definition
 */
CvPlsHelper.modules.notifications = {
    load: function() {
        return new DesktopNotificationDispatcher();
    }
};
