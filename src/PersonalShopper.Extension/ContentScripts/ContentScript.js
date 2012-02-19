var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.APPLICATION = PERSONALSHOPPER.APPLICATION || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.APPLICATION.contentScript = (function (productPageMediator) {
    return {
        init: function (config) {
        	var mediator = new productPageMediator({});
            if(config.trackAddToCartClicks){
                var addToCartMatches = mediator.findButtons();
                mediator.trackAddToCartClicks(addToCartMatches.getElementMatches());
            }
        	if(config.notifyIfProductPage){
        		mediator.detectAndNotifyIfProductPage();
        	}
        }
    };
})(PERSONALSHOPPER.APPLICATION.productPageMediator);

PERSONALSHOPPER.APPLICATION.contentScript.init({trackAddToCartClicks: true, notifyIfProductPage: true});