/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, XPathResult */

CvPlsHelper.chrome.SettingsManager = function(pluginSettings, dupeSettingsManager) {

  "use strict";

  var self = this;

  this.getInputByName = function(name) {
    var input = document.evaluate(".//*[@name='"+name+"']", document.getElementById('page-container'), null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    if (input) {
      self[name] = input;
      return true;
    }
    return false;
  };

  this.toggleInput = function(input, state) {
    var el, span, classes, classIndex;

    input.disabled = !state;

    for (el in input.parentNode.children) {
      if (typeof input.parentNode.children[el] !== 'function' && input.parentNode.children[el].hasOwnProperty('tagName') && input.parentNode.children[el].tagName.toUpperCase() === 'SPAN') {
        span = input.parentNode.children[el];
        break;
      }
    }

    if (span !== undefined) {
      classes = (span.getAttribute('class') || '').split(/\s+/);
      if (state) {
        classIndex = classes.indexOf('disabled');
        if (classIndex > -1) {
          classes.splice(classIndex, 1);
        }
      } else {
        classes.push('disabled');
      }
      span.setAttribute('class', classes.join(' ').replace(/^\s+|\s+$/, ''));
    }
  };

  this.initShowIcon = function() {
    if (self.getInputByName('showIcon')) {
      self.showIcon.checked = pluginSettings.getSetting('showIcon');
      self.showIcon.addEventListener('change', function() {
        pluginSettings.saveSetting('showIcon', this.checked);
      });
    }
  };

  this.initOneBox = function() {
    self.initOneBoxHeight();
    if (self.getInputByName('oneBox')) {
      self.oneBox.checked = pluginSettings.getSetting('oneBox');
      if (!self.oneBox.checked) {
        self.oneBoxHeight.disabled = true;
      }
      self.oneBox.addEventListener('change', function() {
        pluginSettings.saveSetting('oneBox', this.checked);
        self.oneBoxHeight.disabled = !this.checked;
      });
    }
  };
  this.initOneBoxHeight = function() {
    if (self.getInputByName('oneBoxHeight')) {
      self.oneBoxHeight.value = pluginSettings.getSetting('oneBoxHeight');
      self.oneBoxHeight.addEventListener('keyup', function() {
        pluginSettings.saveSetting('oneBoxHeight', this.value);
      });
      self.oneBoxHeight.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  };

  (function() {
    self.initShowIcon();
    self.initOneBox();
  }());

};