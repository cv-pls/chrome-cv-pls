/*jslint plusplus: true, white: true, browser: true */

/*
 * Represents a single open tab where the extension is running
 */
(function() {
    /**
     * Constructor
     */
    Tab = function(backgroundPage, id, url, classNames)
    {
        this.backgroundPage = backgroundPage;
        this.id             = id;
        this.url            = url;
        this.classNames     = classNames;

        this.eventHandlers = {
            close: []
        };
    };

    /**
     * @var {object} Collection of event handler callbacks
     */
    Tab.prototype.eventHandlers = null;

    /**
     * @var {BackgroundPage} The extension's background page
     */
    Tab.prototype.backgroundPage = null;

    /**
     * @var {object} Collection of event handler callbacks
     */
    Tab.prototype.id = null;

    /**
     * @var {object} Collection of event handler callbacks
     */
    Tab.prototype.url = null;

    /**
     * @var {object} Collection of event handler callbacks
     */
    Tab.prototype.classNames = null;

    /**
     * Register an event handler
     *
     * @param {string}   eventName The name of the event being handled
     * @param {function} callback  The callback handling the event
     *
     * @throws Error When an invalid event name is specified
     */
    Tab.prototype.on = function(eventName, callback)
    {
        if (this.eventHandlers[eventName] === undefined) {
            throw new Error('Unknown event name: ' + eventName);
        }

        if (!this.eventHandlers[eventName].indexOf(callback)) {
            this.eventHandlers[eventName].push(callback);
        }
    };

    /**
     * Unregister an event handler
     *
     * @param {string}   eventName The name of the event being handled
     * @param {function} callback  The callback handling the event
     *
     * @throws Error When an invalid event name is specified
     */
    Tab.prototype.off = function(eventName, callback)
    {
        var index;

        if (this.eventHandlers[eventName] === undefined) {
            throw new Error('Unknown event name: ' + eventName);
        }

        index = this.eventHandlers[eventName].indexOf(callback);
        if (index >= 0) {
            this.eventHandlers[eventName].splice(index, 1);
        }
    };

    /**
     * Trigger an event
     *
     * @param {string} eventName The name of the event being triggered
     * @param {object} ...       Additional arguments to be passed to the event handler
     *
     * @throws Error When an invalid event name is specified
     */
    Tab.prototype.trigger = function(eventName)
    {
        var i, l, callbackResult, result, args = [];

        if (this.eventHandlers[eventName] === undefined) {
            throw new Error('Unknown event name: ' + eventName);
        }

        for (i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }

        for (i = 0, l = this.eventHandlers[eventName].length; i < l; i++) {
            callbackResult = this.eventHandlers[eventName][i].apply(null, args);

            if (callbackResult === false) {
                break;
            } else if (callbackResult !== undefined && result === undefined) {
                result = callbackResult;
            }
        }

        return result;
    };

    /**
     * Send a message to the tab
     *
     * @param {object} message A JSON-serializable object to send to the tab
     */
    Tab.prototype.sendMessage = function(message)
    {
        var that = this,
            data = {
                dest: that.id,
                message: message
            };

        this.backgroundPage.sendMessage('tabMessage', data);
    };

    /**
     * Get the URL the tab is displaying
     */
    Tab.prototype.getUrl = function()
    {
        return this.url;
    };

    /**
     * Get the ID of the tab
     */
    Tab.prototype.getId = function()
    {
        return this.id;
    };

    /**
     * Check whether the tab has a specific class name
     */
    Tab.prototype.hasClassName = function(className)
    {
        return this.classNames.indexOf(className) >= 0;
    };
}());
