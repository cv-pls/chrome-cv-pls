/*jslint plusplus: true, white: true, browser: true */
/*global TabStore */

/**
 * Data store that holds a cache of Tabs that have been created
 */
(function() {
    /**
     * Constructor
     *
     * @param {TabFactory}   tabFactory   Factory which makes Tab objects
     * @param {UIDGenerator} uidGenerator ID generator
     */
    TabStore = function(tabFactory, uidGenerator)
    {
        this.dataStore = {};
    };

    /**
     * @var {object} Map of Tabs objects being stored
     */
    TabStore.prototype.dataStore = null;

    /**
     * Store a new tab object
     *
     * @param {Tab} tab The Tab object being stored
     *
     * @throws Error When the tab already exists
     */
    TabStore.prototype.addTab = function(tab)
    {
        if (this.dataStore[tab.id] !== undefined) {
            throw new Error('The passed Tab already exists in the store');
        }
        
        this.dataStore[tab.id] = tab;
        tab.on('close', function(tab) {
            this.removeTab(tab);
        }.bind(this));
    };

    /**
     * Remove a tab from the store
     *
     * @param {Tab} tab The Tab object being removed
     */
    TabStore.prototype.removeTab = function(tab)
    {
        if (this.dataStore[tab.id] !== undefined) {
            delete this.dataStore[tab.id];
        }
    };

    /**
     * Get a stored tab by its ID
     *
     * @param {string} id The Tab ID
     *
     * @return {Tab}|null The Tab with the specified ID, if it exists
     */
    TabStore.prototype.getTabById = function(id)
    {
        if (this.dataStore[id] !== undefined) {
            return this.dataStore[id];
        }

        return null;
    };
}());
