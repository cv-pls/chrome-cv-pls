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
     * @param {Tab}          currentTab   Tab object representing the active tab
     */
    MessageFactory = function(uidGenerator, currentTab, tabFactory)
    {
        this.uidGenerator = uidGenerator;
        this.currentTab   = currentTab;
        this.tabFactory   = tabFactory;
    };

    /**
     * @var {UIDGenerator} Object which generates IDs
     */
    MessageFactory.prototype.uidGenerator = null;

    /**
     * @var {Tab} Tab object representing the active tab
     */
    MessageFactory.prototype.currentTab = null;

    /**
     * @var {TabFactory} Factory which makes Tab objects
     */
    MessageFactory.prototype.tabFactory = null;

    /**
     * Create a new Message
     *
     * @return {Message} The created object
     */
    MessageFactory.prototype.create = function(method, data, id)
    {
        id = id || this.uidGenerator.generate();
        return new Message(id, this.currentTab, method, data);
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

        return new Message(obj.id, this.tabFactory.createFromObject(obj.sender), obj.method, obj.data);
    };
}());
