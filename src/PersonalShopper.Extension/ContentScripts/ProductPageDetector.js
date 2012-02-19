/// <reference path="~/Utilities.js" />
var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ADDTOLIST = PERSONALSHOPPER.ADDTOLIST || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;


PERSONALSHOPPER.ADDTOLIST.productPageDetector = (function (elementFinder, productRetrievalStrategies) {
	var getProductRetrievalStrategy = function(){
		return productRetrievalStrategies.findProductNearAddToCartButton;
	};
	return {
        isProductPage: function(view){
        	return productRetrievalStrategies.utilities.addToCartElementExists(view);
        },
        getProductName : function(view){
        	return productRetrievalStrategies.utilities.getTitleFromView(view);
        },
        getProductInfo : function(){
        	var productRetrievalStrategy = getProductRetrievalStrategy();
        	return productRetrievalStrategy.getProductInfo();
        },
        getProductInfoAroundAddToCartButton : function(button){
            var productRetrievalStrategy = getProductRetrievalStrategy();
            return productRetrievalStrategy.getProductInfoAroundAddToCartButtons(null, [button]);
        },
        getAddToCartMatches : function(view){
        	return productRetrievalStrategies.utilities.getAllAddToCartMatches(view);
        }
    }
})(PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder, PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL);