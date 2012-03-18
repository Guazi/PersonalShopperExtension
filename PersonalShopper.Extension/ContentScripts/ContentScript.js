var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTENTSCRIPTS.main = (function ($, ProductPage, shoppingListConstr) {
    var shoppingList = null,
    initBookMarklet = function(){
        var $bookMarkletView = $(document.body);
        if(!shoppingList){
            shoppingList = new shoppingListConstr($bookMarkletView);
        }
        return $bookMarkletView;
    };
    return {
        init: function (config) {
            var $bookMarkletView = initBookMarklet();
        	var mediator = new ProductPage($bookMarkletView);
            if(config.trackAddToCartClicks){
                var addToCartMatches = mediator.findButtons();
                mediator.trackAddToCartClicks(addToCartMatches.getElementMatches());
            }
        	if(config.notifyIfProductPage){
        		mediator.detectAndNotifyIfProductPage();
        	}
        },
        showShoppingList : function(userName){
            debug.log('showing shopping list.');
            shoppingList.showShoppingList(userName);
        }
    };
})(jQuery, PERSONALSHOPPER.CONTENTSCRIPTS.ProductPage, PERSONALSHOPPER.BOOKMARKLETS.ShoppingList);

// main program execution, through events
(function(main, eventBroker){
    main.init({trackAddToCartClicks: true, notifyIfProductPage: true});
    // message passing from background page
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            if(request.command == 'showShoppingList'){
                // send request back to get the username, and call showShoppingList with usernmae
                chrome.extension.sendRequest({command: 'getUserName'}, function(userName){
                    main.showShoppingList(userName);
                });
            }
        }
    );
    // message passing to background page
    var userNameSetCommand = 'userNameSet';
    eventBroker.bind(userNameSetCommand, function(userName){
        chrome.extension.sendRequest({command: userNameSetCommand, userName : userName});
    });
})(PERSONALSHOPPER.CONTENTSCRIPTS.main, PERSONALSHOPPER.UTILITIES.eventBroker);