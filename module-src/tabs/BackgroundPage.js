/*jslint plusplus: true, white: true, browser: true */
/*global chrome */

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
    BackgroundPage = function(messageFactory)
    {
        this.messageFactory = messageFactory;
        this.tabStore       = tabStore;

        this.port = chrome.extension.connect({name: 'tabs'});
        this.port.onMessage.addEventListener(function(message) {
            this.onMessage(message);
        }.bind(this));

        this.pendingResponses = {};
        this.eventHandlers = {
          message: []
        };
    };

    /**
     * @var {MessageFactory} Factory which makes Message objects
     */
    BackgroundPage.prototype.messageFactory = null;

    /**
     * @var {chrome.Port} Port for persistent connection to background page
     */
    BackgroundPage.prototype.port = null;

    /**
     * @var {object} Sent messages awaiting responses
     */
    BackgroundPage.prototype.pendingResponses = null;

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
     * Send a message to the background page
     *
     * @param {Message} message  The message to send
     * @param function  callback Callback function to hand the response
     */
    BackgroundPage.prototype.sendRawMessage = function(message, callback)
    {
        if (message.method !== 'respond' && callback !== undefined) {
            this.pendingResponses[message.id] = callback;
        }

        this.port.postMessage({
            id: message.id,
            sender: {
                id: message.sender.id,
                url: message.sender.url,
                classNames: message.sender.classNames
            },
            method: message.method,
            data: message.data
        });
    };

    /**
     * Construct and send a message to the background page
     *
     * @param {string} message  The message method
     * @param mixed    data     The message data
     * @param function callback Callback function to hand the response
     */
    BackgroundPage.prototype.sendMessage = function(method, data, callback)
    {
        this.sendRawMessage(this.messageFactory.create(method, data), callback);
    };

    /**
     * Process a message received from the background page
     *
     * @param {object} message The message to send
     */
    BackgroundPage.prototype.onMessage = function(message)
    {
        var result, response;

        try {
            message = this.messageFactory.createFromObject(message);

            switch (message.method) {
                case 'respond':
                    if (this.pendingResponses[message.id] !== undefined) {
                        if (message.data !== undefined && typeof this.pendingResponses[message.id] === 'function') {
                            this.pendingResponses[message.id].call(null, message.data);
                        }

                        delete this.pendingResponses[message.id];
                    }
                    break;

                case 'closeTab':
                    message.sender.trigger('close');

                    response = this.messageFactory.create('respond', result, message.id);

                    this.sendRawMessage(response);
                    break;

                default:
                    result = this.trigger('message', message);
                    response = this.messageFactory.create('respond', result, message.id);

                    this.sendRawMessage(response);
                    break;
            }
        } catch (e) {
            console.error(e.message);
        }
    };
}());
