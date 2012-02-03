var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.APPLICATION = PERSONALSHOPPER.APPLICATION || {};

var globalConfig = PERSONALSHOPPER.globalConfiguration || {};

PERSONALSHOPPER.APPLICATION.productPageMediator = (function (productPageDetector, addToListPrompter, addToListWindow) {
    var writeFoundMatches = function (foundMatches) {
        if (globalConfig.debug) {
        	log("matches:");
        	for(var i = 0, max = foundMatches.length; i < max; i++){
        		log(foundMatches[i].getNode());
            }
        }
    },
	log = function(){
		if(globalConfig.debug && console)
			console.log(toLog);
    },
	Constr = function(config){
		this.config = config;
	};
	Constr.prototype = {
		constructor : PERSONALSHOPPER.APPLICATION.productPageMediator,
		findButtons : function(){
	        var addToCartMatches = productPageDetector.getAddToCartMatches(document);
	        if(addToCartMatches.hasMatch()){
	        	writeFoundMatches(addToCartMatches.getTextMatches());
	        	writeFoundMatches(addToCartMatches.getElementMatches());
	       	}
		},
		detectAndNotifyIfProductPage : function(){
			var isProductPage = productPageDetector.isProductPage(document);
			log('Is Product Page?');
			log(isProductPage);				
			if(isProductPage){
				var productTitle = productPageDetector.getProductName(document);
				var self = this;
				var origFn = this.openAddToListWindow;
				var prompter = new addToListPrompter(document.body, productTitle);
				var openAddToListWindowFunction = function() {
					return origFn.apply(self, [prompter, productTitle]);
				};
				prompter.promptToAddToList(openAddToListWindowFunction);
			}
		},
		openAddToListWindow : function(addToListPrompter, productTitle){
			console.log(productTitle);
			addToListPrompter.closePromptToAddToList();
			var listWindow = new addToListWindow(document.body);
			listWindow.openAndLoad(productTitle);
		}
	};
    return Constr;
})(PERSONALSHOPPER.ADDTOLIST.productPageDetector,
	PERSONALSHOPPER.BOOKMARKLETS.addToListPrompter,
	PERSONALSHOPPER.BOOKMARKLETS.addToListWindow);