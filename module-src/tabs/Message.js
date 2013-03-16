/*jslint plusplus: true, white: true, browser: true */
/*global Message */

/**
 * Factory which makes Message objects
 */
(function() {
    /**
     * Constructor
     *
     * @param {integer} id     The message ID
     * @param {string}  method The message method
     * @param {object}  data   The message data
     */
    Message = function(id, method, data)
    {
        this.id     = id;
        this.method = method;
        this.data   = data;
    };

    /**
     * @var {integer} The message ID
     */
    Message.prototype.id = null;

    /**
     * @var {string} The message method
     */
    Message.prototype.method = null;

    /**
     * @var {object} The message data
     */
    Message.prototype.data = null;
}());
