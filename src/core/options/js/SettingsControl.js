(function() {

  'use strict';

  function addClass(el, className) {
    var classNames = el.className.replace(/^\s+|\s+$/, '').split(/\s+/);
    if (classNames.indexOf(className) < 0) {
      classNames.push(className);
    }
    el.className = classNames.join(' ');
  }
  function removeClass(el, className) {
    var pos, classNames = el.className.replace(/^\s+|\s+$/, '').split(/\s+/);
    pos = classNames.indexOf(className);
    if (pos >= 0) {
      classNames.splice(pos, 1);
    }
    el.className = classNames.join(' ');
  }

  function loadControl() {
    this.controlElement = document.getElementById('pref-control-'+this.prefName);
  }

  function loadDependants() {
    var i, l, dependantPrefName, dependants = document.querySelectorAll('.depends-on-'+this.prefName);
    for (i = 0, l = dependants.length; i < l; i++) {
      dependantPrefName = dependants[i].id.split('-').pop();
      this.dependants.push(this.settingsControlManager.create(dependantPrefName));
    }
  }

  function loadLabels() {
    var i, l, labels = document.querySelectorAll('label[for="pref-control-'+this.prefName+'"]');
    for (i = 0, l = labels.length; i < l; i++) {
      this.labels.push(labels[i]);
    }
  }

  function setCheckboxInitialState() {
    this.controlElement.checked = Boolean(this.pluginSettings.getSetting(this.prefName));
    if (!this.controlElement.checked) {
      this.disableDependants();
    }
  }
  function setTextboxInitialState() {
    this.controlElement.value = String(this.pluginSettings.getSetting(this.prefName));
  }
  function setInitialState() {
    switch (this.controlElement.type) {
      case 'checkbox':
        setCheckboxInitialState.call(this);
        break;
      default:
        setTextboxInitialState.call(this);
        break;
    }
  }

  function attachCheckboxEvent() {
    var self = this;
    self.controlElement.addEventListener('change', function() {
      self.pluginSettings.saveSetting(self.prefName, this.checked);
      if (!this.checked) {
        self.disableDependants();
      } else {
        self.enableDependants();
      }
    });
  }
  function attachTextboxEvent() {
    var self = this;
    self.controlElement.addEventListener('keyup', function() {
      var value;

      if (this.getAttribute('data-type') === 'number') {
        value = parseFloat(this.value);
      } else {
        value = this.value;
      }

      self.pluginSettings.saveSetting(self.prefName, value);
    });
  }
  function attachEventHandler() {
    switch (this.controlElement.type) {
      case 'checkbox':
        attachCheckboxEvent.call(this);
        break;
      default:
        attachTextboxEvent.call(this);
        break;
    }
  }

  function init() {
    loadControl.call(this);
    loadDependants.call(this);
    loadLabels.call(this);

    setInitialState.call(this);

    attachEventHandler.call(this);
  }

  CvPlsHelper.chrome.SettingsControl = function(prefName, settingsControlManager, pluginSettings){
    this.prefName = prefName;
    this.settingsControlManager = settingsControlManager;
    this.pluginSettings = pluginSettings;

    this.dependants = [];
    this.labels = [];

    init.call(this);
  };

  CvPlsHelper.chrome.SettingsControl.prototype.prefName = null;
  CvPlsHelper.chrome.SettingsControl.prototype.settingsControlManager = null;
  CvPlsHelper.chrome.SettingsControl.prototype.pluginSettings = null;

  CvPlsHelper.chrome.SettingsControl.prototype.controlElement = null;

  CvPlsHelper.chrome.SettingsControl.prototype.dependants = null;
  CvPlsHelper.chrome.SettingsControl.prototype.labels = null;

  CvPlsHelper.chrome.SettingsControl.prototype.disable = function() {
    var i, l;

    this.controlElement.disabled = true;

    for (i = 0, l = this.labels.length; i < l; i++) {
      addClass(this.labels[i], 'disabled');
    }

    this.disableDependants();
  };

  CvPlsHelper.chrome.SettingsControl.prototype.enable = function() {
    var i, l;

    this.controlElement.disabled = false;

    for (i = 0, l = this.labels.length; i < l; i++) {
      removeClass(this.labels[i], 'disabled');
    }

    if (this.controlElement.type === 'checkbox' && this.controlElement.checked) {
      this.enableDependants();
    }
  };

  CvPlsHelper.chrome.SettingsControl.prototype.disableDependants = function() {
    var i, l;
    for (i = 0, l = this.dependants.length; i < l; i++) {
      this.dependants[i].disable();
    }
  };

  CvPlsHelper.chrome.SettingsControl.prototype.enableDependants = function() {
    var i, l;
    for (i = 0, l = this.dependants.length; i < l; i++) {
      this.dependants[i].enable();
    }
  };

}());