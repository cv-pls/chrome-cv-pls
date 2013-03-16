/*jslint plusplus: true, white: true, browser: true */

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
