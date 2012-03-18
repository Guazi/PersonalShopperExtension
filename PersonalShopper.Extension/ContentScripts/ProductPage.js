var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTENTSCRIPTS.ProductPage = (function (productPageDetector, saveForLaterPrompter, saveForLater, shoppingListServiceClient) {
    var trackAddToCartListTypeId = 0,
    writeFoundMatches = function (foundMatches) {
    	debug.log("matches:");
    	for(var i = 0, max = foundMatches.length; i < max; i++){
    		debug.log(foundMatches[i]);
        }        
    },
    trackAddToCartClick = function(button){
        debug.log(['tracking click of:',button]);
        var productInfo = productPageDetector.getProductInfoAroundAddToCartButton(button);
        if(productInfo){
            getUserName(function(userName){
                shoppingListServiceClient.addProductToList(productInfo, userName, trackAddToCartListTypeId, function(responseText){
                    debug.log(responseText);
                });
            });
        }
    },
    getUserName = function(callback){
        // send request back to get the username, and call showShoppingList with usernmae
        chrome.extension.sendRequest({command: 'getUserName'}, function(userName){
            callback(userName);
        });
    };
	Constr = function($bookMarkletView){
		this.userName = null;
        this.saveForLaterPrompter = new saveForLaterPrompter($bookMarkletView);
        this.saveForLater = new saveForLater($bookMarkletView);
        var self = this;
        eventBroker.bind('saveForLaterDesired', function(product){
            self.saveForLaterDesired(product);
        });
	};
	Constr.prototype = {
		findButtons : function(){
	        var addToCartMatches = productPageDetector.getAddToCartMatches(document.body);
	        if(addToCartMatches.hasMatch()){
	        	writeFoundMatches(addToCartMatches.getTextMatches());
	        	writeFoundMatches(addToCartMatches.getElementMatches());
	       	}
            return addToCartMatches;
		},
		detectAndNotifyIfProductPage : function(){
			var isProductPage = productPageDetector.isProductPage(document.body);
			debug.log('Is Product Page?');
			debug.log(isProductPage);				
			if(isProductPage){
				var product = productPageDetector.getProductInfo();
                this.saveForLaterPrompter.promptToAddToList(product);
			}
		},
        trackAddToCartClicks : function(addToCartButtons){
            for(var i = 0, max = addToCartButtons.length; i < max; i++){
                var addToCartButton = addToCartButtons[i];
                var currentOnClick = addToCartButton.onclick;
                addToCartButton.onclick = function(){
                    trackAddToCartClick(this);
                    if(currentOnClick)
                        currentOnClick();
                }
            }
        },
        saveForLaterDesired : function(product){
            this.saveForLater.openSaveForLater(product);
        }
	};
    return Constr;
})(PERSONALSHOPPER.ADDTOLIST.productPageDetector,
    PERSONALSHOPPER.BOOKMARKLETS.SaveForLaterPrompter,
    PERSONALSHOPPER.BOOKMARKLETS.SaveForLater,
    PERSONALSHOPPER.SERVICES.shoppingListServiceClient);