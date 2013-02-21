(function() {

  CvPlsHelper.chrome.SettingsForm = function(settingsControlManager) {
    this.settingsControlManager = settingsControlManager;
  };

  CvPlsHelper.chrome.SettingsForm.prototype.settingsControlManager = null;

  CvPlsHelper.chrome.SettingsForm.prototype.init = function() {
    var i, l, prefName, controlEls = document.querySelectorAll('*[id^="pref-control-"]');
    for (i = 0, l = controlEls.length; i < l; i++) {
      prefName = controlEls[i].id.split('-').pop();
      this.settingsControlManager.create(prefName);
    }
  };

}());