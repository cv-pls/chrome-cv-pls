/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper */

/**
 * @var {TabManager} Persistent TabManager instance
 */
var tabManager;

/**
 * Module definition
 */
(function() {

    'use strict';

    var currentTab, tabStore, tabFactory, backgroundPageFactory, messageFactory;

    currentTab = new Tab();
    tabStore = new TabStore();

    messageFactory = new MessageFactory(new UIDGenerator(), currentTab);
    backgroundPage = new BackgroundPage(messageFactory, tabStore);

    tabFactory = new TabFactory(backgroundPage, new TabStore());

    tabManager = new TabManager(backgroundPage, messageFactory, tabFactory, tabStore);

}());
