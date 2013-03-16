/*jslint plusplus: true, white: true, browser: true */
/*global BackgroundPage */

/**
 * Factory which makes BackgroundPage objects
 */
(function() {
    /**
     * Constructor
     *
     * @param {TabFactory}   tabFactory   Factory which makes Tab objects
     * @param {UIDGenerator} uidGenerator ID generator
     */
    BackgroundPageFactory = function(tabFactory, uidGenerator)
    {
        this.tabFactory   = tabFactory;
        this.uidGenerator = uidGenerator;
    };

    /**
     * @var {TabFactory} Factory which makes Tab objects
     */
    BackgroundPageFactory.prototype.tabFactory = null;

    /**
     * @var {UIDGenerator} ID generator
     */
    BackgroundPageFactory.prototype.uidGenerator = null;

    /**
     * Create a new BackgroundPage object
     *
     * @param {TabManager} tabManager Tab manager for the current page
     *
     * @return {BackgroundPage} The created object
     */
    BackgroundPageFactory.prototype.create = function(tabManager)
    {
        return new BackgroundPage(tabManager, this.tabFactory, this.uidGenerator);
    };
}());
