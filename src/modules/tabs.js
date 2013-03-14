/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, chrome */

(function() {

    'use strict';

    // Declare variables
    var Tab, TabManager,
        BackgroundPage, BackgroundPageConnection,
        tabManager;

    // Module definition
    CvPlsHelper.modules.tabs = {
        load: function(args) {
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
        TabManager = function(backgroundPage)
        {
            this.eventHandlers = {
                newtab: []
            };
        };

        /**
         * @var {object} Collection of event handler callbacks
         */
        TabManager.prototype.eventHandlers = null;

        /**
         * Register an event handler
         *
         * @var {string}   eventName The name of the event being handled
         * @var {function} callback  The callback handling the event
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
         * @var {string}   eventName The name of the event being handled
         * @var {function} callback  The callback handling the event
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
         * @throws Error When an invalid event name is specified
         */
        TabManager.prototype.trigger = function(eventName)
        {
            var i, l, args = [];

            if (this.eventHandlers[eventName] === undefined) {
                throw new Error('Unknown event name: ' + eventName);
            }

            for (i = 1, l = arguments.length; i < l; i++) {
                args.push(arguments[i]);
            }

            for (i = 0, l = this.eventHandlers[eventName].length; i < l; i++) {
                this.eventHandlers[eventName][i].call(null, args);
            }
        };

        TabManager.prototype.getTabById = function(id)
        {
        };

        TabManager.prototype.getTabsByClassName = function(className)
        {
        };

        TabManager.prototype.getTabsByURL = function(url)
        {
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
        Tab = function()
        {
            this.eventHandlers = {
                message: [],
                close:   []
            };
        };

        /**
         * @var {object} Collection of event handler callbacks
         */
        Tab.prototype.eventHandlers = null;

        /**
         * Register an event handler
         *
         * @var {string}   eventName The name of the event being handled
         * @var {function} callback  The callback handling the event
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
         * @var {string}   eventName The name of the event being handled
         * @var {function} callback  The callback handling the event
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
         * @throws Error When an invalid event name is specified
         */
        Tab.prototype.trigger = function(eventName)
        {
            var i, l, args = [];

            if (this.eventHandlers[eventName] === undefined) {
                throw new Error('Unknown event name: ' + eventName);
            }

            for (i = 1, l = arguments.length; i < l; i++) {
                args.push(arguments[i]);
            }

            for (i = 0, l = this.eventHandlers[eventName].length; i < l; i++) {
                this.eventHandlers[eventName][i].call(null, args);
            }
        };

        /**
         * Send a message to the tab
         *
         * @param {object} message A JSON-serializable object to send to the tab
         */
        Tab.prototype.sendMessage = function(message)
        {
        };

        /**
         * Get the URL the tab is displaying
         */
        Tab.prototype.getUrl = function()
        {
        };

        /**
         * Get the ID of the tab
         */
        Tab.prototype.getId = function()
        {
        };

        /**
         * Get the tab's class names
         */
        Tab.prototype.getClassNames = function()
        {
        };
    }());

    tabManager = new TabManager(new BackgroundPage(new BackgroundPageConnection()));

}());
