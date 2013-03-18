/*jslint plusplus: true, white: true, browser: true */
/*global BackgroundPage */

/**
 * Factory which makes Tab objects
 */
(function() {
    /**
     * Constructor
     *
     * @param {BackgroundPage} backgroundPage The extension's background page
     */
    TabFactory = function(backgroundPage, tabStore)
    {
        this.backgroundPage = backgroundPage;
        this.tabStore       = tabStore;
    };

    /**
     * @var {BackgroundPage} The extension's background page
     */
    TabFactory.prototype.backgroundPage = null;

    /**
     * @var {TabStore} Object which holds a collection of accessed tab objects
     */
    TabFactory.prototype.tabStore = null;

    /**
     * Create a new Tab object based on another object
     *
     * @param {BackgroundPage} backgroundPage The extension background page object
     * @param {object}         obj            The base object to use
     *
     * @return {Tab} The created object
     *
     * @throws Error Error When the passed object does not represent a valid tab
     */
    TabFactory.prototype.createFromObject = function(obj)
    {
        var tab;

        if (obj.id === undefined || obj.url === undefined || obj.classNames === undefined) {
            throw new Error('The passed object cannot be converted to a valid Tab');
        }

        tab = tabStore.getTabById(obj.id);
        if (!tab) {
            tab = new Tab(this.backgroundPage, obj.id, obj.url, obj.classNames);
            tabStore.addTab(tab);
        }

        return tab;
    };
}());
