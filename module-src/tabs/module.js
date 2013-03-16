/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

/**
 * @var {TabManager} Persistent TabManager instance
 */
var tabManager;

/**
 * Module definition
 */
CvPlsHelper.modules.tabs = {
    load: function(args) {
        var tabFactory, backgroundPageFactory;
        tabFactory = new TabFactory();
        backgroundPageFactory = new BackgroundPageFactory(tabFactory, new UIDGenerator());

        if (tabManager === undefined) {
            tabManager = new TabManager(backgroundPageFactory);
        }

        return tabManager;
    }
};
