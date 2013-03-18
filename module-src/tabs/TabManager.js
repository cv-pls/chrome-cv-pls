/*jslint plusplus: true, white: true, browser: true */

/*
 * The publicly accessible module object
 */
(function() {
    /**
     * Constructor
     */
    TabManager = function(backgroundPage, messageFactory, tabFactory, tabStore)
    {
        this.backgroundPage = backgroundPage;
        this.messageFactory = messageFactory;
        this.tabFactory     = tabFactory;
        this.tabStore       = tabStore;

        backgroundPage.on('message', function(message) {
            this.onMessage(message);
        }.bind(this));

        this.eventHandlers = {
            newtab:  [],
            message: []
        };
    };

    /**
     * @var {BackgroundPage} The extension's background page
     */
    TabManager.prototype.backgroundPage = null;

    /**
     * @var {BackgroundPage} Factory which makes message objects
     */
    TabManager.prototype.messageFactory = null;

    /**
     * @var {BackgroundPage} The extension's background page
     */
    TabManager.prototype.tabFactory = null;

    /**
     * @var {TabStore} Object which holds a collection of accessed tab objects
     */
    TabFactory.prototype.tabStore = null;

    /**
     * @var {object} Collection of event handler callbacks
     */
    TabManager.prototype.eventHandlers = null;

    /**
     * Register an event handler
     *
     * @param {string}   eventName The name of the event being handled
     * @param {function} callback  The callback handling the event
     *
     * @throws Error When an invalid event name is specified
     */
    TabManager.prototype.on = function(eventName, callback)
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
    TabManager.prototype.off = function(eventName, callback)
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
    TabManager.prototype.trigger = function(eventName)
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
     * Handle a message received from the background page
     *
     * @param {Message} message The recieved message
     *
     * @return mixed The return value of the any register event handlers
     */
    TabManager.prototype.onMessage = function(message)
    {
        switch (message.method) {
            case 'newTab':
                result = this.trigger(
                    'newtab',
                    message.sender
                );
                break;

            case 'message':
                result = this.trigger(
                    'message',
                    message.data,
                    message.sender
                );
                break;
 
            default:
                this.trigger
                break;
        }
    };

    /**
     * Get a Tab by its ID
     *
     * @param {string}   id       The ID of the Tab to retrieve
     * @param {function} callback Callback to recieve the Tab
     *
     * @throws Error When the callback is not a valid function
     */
    TabManager.prototype.getTabById = function(id, callback)
    {
        var tab, message, that = this;

        if (typeof callback !== 'function') {
            throw new Error('Invalid callback specified');
        }

        tab = this.tabStore.getTabById(id);
        if (tab) {
            callback.call(null, tab);
        } else {
            this.backgroundPage.sendMessage('getTabById', {id: id}, function(response) {
                callback.call(null, that.tabFactory.createFromObject(response));
            });
        }
    };

    /**
     * Get a set of Tabs by a class name
     *
     * @param {string|RegExp} className A class name pattern to match the tabs against
     * @param {function}      callback  Callback to recieve an array of Tabs
     *
     * @throws Error When the callback is not a valid function
     */
    TabManager.prototype.getTabsByClassName = function(className, callback)
    {
        var that = this,
            pattern = className instanceof RegExp ? {regex: className.toString()} : {string: className};
            message = {
                method: 'getTabsByClassName',
                data:   pattern
            };

        if (typeof callback !== 'function') {
            throw new Error('Invalid callback specified');
        }

        this.backgroundPage.sendMessage(message, function(response) {
            var i, l, tabs = [];

            for (i = 0, l = response.length; i < l; i++) {
                tabs.push(that.tabFactory.createFromObject(that.backgroundPage, response[i]));
            }

            callback.call(null, tabs);
        });
    };

    /**
     * Get a set of Tabs by URL
     *
     * @param {string|RegExp} className A URL pattern to match the tabs against
     * @param {function}      callback  Callback to recieve an array of Tabs
     *
     * @throws Error When the callback is not a valid function
     */
    TabManager.prototype.getTabsByUrl = function(url, callback)
    {
        /* reminder: how to serialize a regex to a string and back
          parts = /hello world/.toString().match(/^\/(.*?)\/([a-z]*)$/i);
          console.log(new RegExp(parts[1], parts[2]));
        */
        var pattern, that = this;

        if (typeof callback !== 'function') {
            throw new Error('Invalid callback specified');
        }

        pattern = url instanceof RegExp ? {regex: url.toString()} : {string: url};

        this.backgroundPage.sendMessage('getTabsByUrl', pattern, function(response) {
            var i, l, tabs = [];

            for (i = 0, l = response.length; i < l; i++) {
                tabs.push(that.tabFactory.createFromObject(that.backgroundPage, response[i]));
            }

            callback.call(null, tabs);
        });
    };

    TabManager.prototype.broadcast = function(message, options)
    {
    };

    TabManager.prototype.sendToFirst = function(message, options)
    {
    };
}());
