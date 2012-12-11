/*jslint plusplus: true, white: true, browser: true */
/*global chrome, webkitNotifications */

(function() {

  'use strict';

  CvPlsHelper.chrome.DesktopNotificationManager = function() {};

  CvPlsHelper.chrome.DesktopNotificationManager.prototype.notification = null;

  CvPlsHelper.chrome.DesktopNotificationManager.prototype.build = function(title, message) {
    var self = this;
    this.notification = webkitNotifications.createNotification(chrome.extension.getURL('cv-pls/icons/icon48.png'), title, message);
    this.notification.onclose = function() {
      self.notification = null;
    };
  };

  CvPlsHelper.chrome.DesktopNotificationManager.prototype.show = function() {
    if (this.notification !== null) {
      this.notification.show();
    }
  };

}());