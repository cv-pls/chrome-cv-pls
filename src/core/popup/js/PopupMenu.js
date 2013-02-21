/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

  'use strict';

  function getOptionsUrl() {
    return chrome.extension.getURL('core/options/html/main.html');
  }

  function getVersion() {
    return chrome.app.getDetails().version;
  }

  function openSettingsPage() {
    chrome.tabs.query({url: getOptionsUrl()}, function(result) {
      if (result.length) {
        chrome.tabs.update(result[0].id, {active: true});
      } else {
        chrome.tabs.create({url: getOptionsUrl()});
      }
    });
  }

  function closePopup() {
    window.close();
    return true;
  }

  CvPlsHelper.chrome.PopUpMenu = function() {
    document.getElementById('moreSettings').addEventListener('click', openSettingsPage);
    document.getElementById('closeButton').addEventListener('click', closePopup);
    document.getElementById('versionNumber').innerText = getVersion();
  };

}());