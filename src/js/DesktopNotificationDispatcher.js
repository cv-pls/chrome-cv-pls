/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

  'use strict';

  CvPlsHelper.chrome.DesktopNotificationDispatcher = function() {};

  CvPlsHelper.chrome.DesktopNotificationDispatcher.prototype.dispatch = function(title, message) {
    chrome.extension.sendMessage({
      method: 'showNotification',
      title: title,
      message: message
    });
  };

}());