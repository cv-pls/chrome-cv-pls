/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */
/* Built with build-module.php at 2013-03-16 01:45:02 GMT */

(function() {

    'use strict';

    var DesktopNotificationDispatcher;

    /**
     * Module definition
     */
    CvPlsHelper.modules.notifications = {
        load: function(args) {
            return new DesktopNotificationDispatcher();
        }
    };

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

}());
