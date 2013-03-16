/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */
/* Built with build-module.php at 2013-03-16 03:21:47 GMT */

(function() {

    'use strict';

    var DesktopNotificationDispatcher;

    /**
     * Relays desktop notifications to the background page
     */
    (function() {
        /**
         * Constructor
         */
        DesktopNotificationDispatcher = function() {};

        /**
         * Dispatch a notification to the background page
         */
        DesktopNotificationDispatcher.prototype.dispatch = function(title, message)
        {
            chrome.extension.sendMessage({
                method: 'showNotification',
                title: title,
                message: message
            });
        };
    }());

    /**
     * Module definition
     */
    CvPlsHelper.modules.notifications = {
        load: function(args) {
            return new DesktopNotificationDispatcher();
        }
    };

}());
