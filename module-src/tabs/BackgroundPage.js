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
