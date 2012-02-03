/// <reference path="~/Utilities.js" />

var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ADDTOLIST = PERSONALSHOPPER.ADDTOLIST || {};

PERSONALSHOPPER.ADDTOLIST.productPageDetector = (function (elementFinder) {
	// dependencies
    var elementFinder = elementFinder,
    // constants
    _addButtonRegex = /add[ -_]{0,1}((to))[ -_]{0,1}(cart|bag|((wish[ -_]{0,1}){0,1}list))/i;
    return {
        getAddToCartMatches: function (document) {
            var textMatches = elementFinder.findTextNodesWithRegex(document, _addButtonRegex);
            //return textMatches;
            var elementMatches = elementFinder.findDeepestElementsWithRegex(document, _addButtonRegex);
            return {
            	getTextMatches : function() { return textMatches; },
            	getElementMatches : function() { return elementMatches; },
            	hasMatch : function() { 
            		return (textMatches.length && textMatches.length > 0) 
            		|| (elementMatches.length && elementMatches.length > 0);
        		}
           	}
        },
        isProductPage: function(document){
        	var firstMatch = elementFinder.findFirstElementWithRegex(document, _addButtonRegex, true);
        	if(firstMatch)
        		return true;
        	else
        		return false;
        },
        getProductName: function(document){
        	return document.title;
        }
    }
})(PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder);