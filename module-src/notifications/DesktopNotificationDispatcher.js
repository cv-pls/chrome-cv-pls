/*jslint plusplus: true, white: true, browser: true */
/*global chrome, DesktopNotificationDispatcher */

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
