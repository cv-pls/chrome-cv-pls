(function() {

  CvPlsHelper.chrome.SettingsControlManager = function(pluginSettings) {
    this.controls = {};
    this.pluginSettings = pluginSettings;
  };

  CvPlsHelper.chrome.SettingsControlManager.prototype.controls = null;
  CvPlsHelper.chrome.SettingsControlManager.prototype.pluginSettings = null;

  CvPlsHelper.chrome.SettingsControlManager.prototype.create = function(prefName) {
    if (this.controls[prefName] === undefined) {
      this.controls[prefName] = new CvPlsHelper.chrome.SettingsControl(prefName, this, this.pluginSettings);
    }
    return this.controls[prefName];
  };

}());