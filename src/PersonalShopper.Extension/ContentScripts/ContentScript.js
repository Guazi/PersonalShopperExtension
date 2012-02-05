var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.APPLICATION = PERSONALSHOPPER.APPLICATION || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.APPLICATION.contentScript = (function (config, productPageMediator) {
    return {
        init: function () {        	
        	var mediator = new productPageMediator({});
        	if(config.findButtons){
        		mediator.findButtons();
        	}
        	if(config.notifyIfProductPage){
        		mediator.detectAndNotifyIfProductPage();
        	}
        }
    };
})({findButtons: true, notifyIfProductPage: true}, 
	PERSONALSHOPPER.APPLICATION.productPageMediator);

PERSONALSHOPPER.APPLICATION.contentScript.init();