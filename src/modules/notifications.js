/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */
/* Built with build-module.php at Mon, 25 Mar 2013 18:03:09 +0000 */

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
        load: function() {
            return new DesktopNotificationDispatcher();
        }
    };

}());
