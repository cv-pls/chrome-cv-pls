/*jslint plusplus: true, white: true, browser: true */
/*global BackgroundPage */

/**
 * Factory which makes Tab objects
 */
(function() {
    /**
     * Constructor
     */
    TabFactory = function() {};

    /**
     * Create a new Tab object based on another object
     *
     * @param {BackgroundPage} backgroundPage The extension background page object
     * @param {object}         object         The base object to use
     *
     * @return {Tab} The created object
     */
    TabFactory.prototype.createFromObject = function(backgroundPage, object)
    {
        return new Tab(backgroundPage, object.id, object.url, object.classNames);
    };
}());
