/*jslint plusplus: true, white: true, browser: true */
/*global chrome */

CvPlsHelper.chrome.DesktopNotificationDispatcher = function() {

  "use strict";

  this.dispatch = function(title, message) {
    chrome.extension.sendMessage({
      method: 'showNotification',
      title: title,
      message: message
    });
  };

};