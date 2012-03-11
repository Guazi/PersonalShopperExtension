var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTENTSCRIPTS.productPage = (function (productPageDetector, addToListPrompter, addToListWindow, shoppingListServiceClient) {
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
            shoppingListServiceClient.addProductToList(productInfo, 'stangogh2@gmail.com', trackAddToCartListTypeId, function(responseText){
               debug.log(responseText);
            });
        }
    },
	Constr = function(config){
		this.config = config;
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
				var productTitle = productPageDetector.getProductName(document.body);
				var self = this;
				var origFn = this.openAddToListWindow;
				var prompter = new addToListPrompter(document.body, productTitle);
				var openAddToListWindowFunction = function() {
					return origFn.apply(self, [prompter, productTitle]);
				};
				prompter.promptToAddToList(openAddToListWindowFunction);
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
		openAddToListWindow : function(addToListPrompter, productTitle){
			debug.log(productTitle);
			addToListPrompter.closePromptToAddToList();
			scrapedProductInfo = productPageDetector.getProductInfo();
			var listWindow = new addToListWindow(document.body);
			listWindow.openAndLoadProduct(scrapedProductInfo);
		}
	};
    return Constr;
})(PERSONALSHOPPER.ADDTOLIST.productPageDetector,
	PERSONALSHOPPER.BOOKMARKLETS.addToListPrompter,
	PERSONALSHOPPER.BOOKMARKLETS.addToListWindow,
    PERSONALSHOPPER.SERVICES.shoppingListServiceClient);