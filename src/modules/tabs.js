/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

    'use strict';

    // Declare variables
    var Tab, TabManager, TabFactory,
        BackgroundPage, BackgroundPageFactory,
        UIDGenerator,
        tabManager;

    // Module definition
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

    /*
     * The publicly accessible module object
     */
    (function() {
        /**
         * Constructor
         */
        TabManager = function(backgroundPageFactory)
        {
            this.backgroundPage = backgroundPageFactory.create(this);

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
         * Get a Tab by its ID
         *
         * @param {string}   id       The ID of the Tab to retrieve
         * @param {function} callback Callback to recieve the Tab
         *
         * @throws Error When the callback is not a valid function
         */
        TabManager.prototype.getTabById = function(id, callback)
        {
            if (typeof callback !== 'function') {
                throw new Error('Invalid callback specified');
            }

            var that = this,
                message = {
                    method: 'getTabById',
                    data:   {id: id}
                };

            this.backgroundPage.sendMessage(message, function(response) {
                callback.call(null, that.tabFactory.createFromObject(that.backgroundPage, response));
            });
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
            var that = this,
                pattern = url instanceof RegExp ? {regex: url.toString()} : {string: url};
                message = {
                    method: 'getTabsByUrl',
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

        TabManager.prototype.broadcast = function(message, options)
        {
        };

        TabManager.prototype.sendToFirst = function(message, options)
        {
        };
    }());

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
        TabManager.prototype.backgroundPage = null;

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
                message = {
                    method: 'tabMessage',
                    tab:    that.id,
                    data:   message
                };

            this.backgroundPage.sendMessage(message);
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

    /**
     * Represents a single open tab where the extension is running
     */
    (function() {
        /**
         * Constructor
         *
         * @param {TabManager} tabManager Tab manager for the current page
         * @param {object}     tabFactory Factory which makes Tab objects
         */
        BackgroundPage = function(tabManager, tabFactory, uidGenerator)
        {
            this.tabManager   = tabManager;
            this.tabFactory   = tabFactory;
            this.uidGenerator = uidGenerator;

            this.port = chrome.extension.connect({name: 'tabs'});
            this.port.onMessage.addEventListener(function(message) {
                this.onMessage(message);
            }.bind(this));

            this.pendingResponses = {};
        };

        /**
         * @var {TabManager} Tab manager for the current page
         */
        BackgroundPage.prototype.tabManager = null;

        /**
         * @var {TabFactory} Factory which makes Tab objects
         */
        BackgroundPage.prototype.tabFactory = null;

        /**
         * @var {UIDGenerator} ID generator
         */
        BackgroundPage.prototype.uidGenerator = null;

        /**
         * @var {chrome.Port} Port for persistent connection to background page
         */
        BackgroundPage.prototype.port = null;

        /**
         * @var {object} Sent messages awaiting responses
         */
        BackgroundPage.prototype.pendingResponses = null;

        /**
         * Send a message to the background page
         *
         * @param {object} message The message to send
         */
        BackgroundPage.prototype.sendMessage = function(message, callback)
        {
            if (message.method !== 'respond') {
                message.id = this.uidGenerator.generate();

                if (callback !== undefined) {
                    this.pendingResponses[message.id] = callback;
                }
            }

            this.port.postMessage(message);
        };

        /**
         * Process a message received from the background page
         *
         * @param {object} message The message to send
         */
        BackgroundPage.prototype.onMessage = function(message)
        {
            var result, response;

            if (message.method === undefined) {
                console.error('Received invalid message from background page (method not present)');
            }

            switch (message.method) {
                case 'newTab':
                    result = this.tabManager.trigger(
                        'newtab',
                        this.tabFactory.createFromObject(this, message.data)
                    );
                    break;

                case 'message':
                    result = this.tabManager.trigger(
                        'message',
                        message.data,
                        this.tabFactory.createFromObject(message.sender)
                    );
                    break;

                case 'respond':
                    if (this.pendingResponses[message.id] !== undefined) {
                        if (message.data !== undefined && typeof this.pendingResponses[message.id] === 'function') {
                            this.pendingResponses[message.id].call(null, message.data);
                        }

                        delete this.pendingResponses[message.id];
                    }
                    break;
            }

            if (message.method !== 'respond') {
                response = {
                    method: 'respond',
                    id: message.id
                };
                if (result !== undefined) {
                    response.data = result;
                }

                this.sendMessage(response);
            }
        };
    }());

    /**
     * Generates IDs with a very low collision risk
     */
    (function() {
        /**
         * Get 4 random hexadecimal characters
         *
         * @return {string} The generated characters
         */
        function rand4() {
            // I largely stole this from http://stackoverflow.com/a/12223573/889949
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).slice(-4);
        }

        /**
         * Get 8 hexadecimal characters based on the current time
         *
         * @return {string} The generated characters
         */
        function time8() {
            return (new Date()).getTime().toString(16).slice(-8);
        }

        /**
         * Constructor
         */
        UIDGenerator = function() {};

        /**
         * Generate an ID
         *
         * @return {string} The generated ID
         */
        UIDGenerator.prototype.generate = function() {
            return this.time8()
                 + '-' + this.rand4()
                 + '-' + this.rand4()
                 + '-' + this.rand4()
                 + '-' + this.rand4() + this.rand4() + this.rand4();
        };
    }());

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
        BackgroundPageFactory = function(tabFactory, uidGenerator) {
            this.tabFactory = tabFactory;
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
        BackgroundPageFactory.prototype.create = function(tabManager) {
            return new BackgroundPage(tabManager, this.tabFactory, this.uidGenerator);
        };
    }());

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
        TabFactory.prototype.createFromObject = function(backgroundPage, object) {
            return new Tab(backgroundPage, object.id, object.url, object.classNames);
        };
    }());

}());
