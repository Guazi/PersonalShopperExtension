var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTENTSCRIPTS.main = (function ($, productPageMediator, bookMarkletConstr) {
    var bookMarklet = null,
    initBookMarklet = function(){
        if(!bookMarklet){
            var $bookMarkletView = $(document.body);
            bookMarklet = new bookMarkletConstr($bookMarkletView);
        }
    };
    return {
        init: function (config) {
            initBookMarklet();
        	var mediator = new productPageMediator({});
            if(config.trackAddToCartClicks){
                var addToCartMatches = mediator.findButtons();
                mediator.trackAddToCartClicks(addToCartMatches.getElementMatches());
            }
        	if(config.notifyIfProductPage){
        		mediator.detectAndNotifyIfProductPage();
        	}
        },
        showShoppingList : function(){
            debug.log('showing shopping list.');
            bookMarklet.showShoppingList();
        }
    };
})(jQuery, PERSONALSHOPPER.CONTENTSCRIPTS.productPage, PERSONALSHOPPER.CONTROLLERS.Bookmarklet);

PERSONALSHOPPER.CONTENTSCRIPTS.main.init({trackAddToCartClicks: true, notifyIfProductPage: true});

(function(main){
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            if(request.command == 'showShoppingList'){
                main.showShoppingList();
            }
        }
    );
})(PERSONALSHOPPER.CONTENTSCRIPTS.main);