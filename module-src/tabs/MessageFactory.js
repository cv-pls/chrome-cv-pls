/*jslint plusplus: true, white: true, browser: true */
/*global MessageFactory */

/**
 * Factory which makes Message objects
 */
(function() {
    /**
     * Constructor
     *
     * @param {UIDGenerator} uidGenerator Object which generates IDs
     */
    MessageFactory = function(uidGenerator)
    {
        this.uidGenerator = uidGenerator;
    };

    /**
     * @var {UIDGenerator} Object which generates IDs
     */
    MessageFactory.prototype.uidGenerator = null;

    /**
     * Create a new Message
     *
     * @return {Message} The created object
     */
    MessageFactory.prototype.create = function(method, data)
    {
        return new Message(this.uidGenerator.generate(), method, data);
    };

    /**
     * Create a new Message from an untyped object
     *
     * @return {Message} The created object
     *
     * @throws Error When the passed object does not represent a valid message
     */
    MessageFactory.prototype.createFromObject = function(obj)
    {
        if (obj.id === undefined || obj.method === undefined || obj.data === undefined) {
            throw new Error('The passed object cannot be converted to a valid Message');
        }

        return new Message(obj.id, obj.method, obj.data);
    };
}());
