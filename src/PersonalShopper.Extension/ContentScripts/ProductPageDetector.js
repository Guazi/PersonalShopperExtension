/// <reference path="~/Utilities.js" />

var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ADDTOLIST = PERSONALSHOPPER.ADDTOLIST || {};

PERSONALSHOPPER.ADDTOLIST.productPageDetector = (function (elementFinder) {
	// dependencies
    var elementFinder = elementFinder,
    // constants
    _addButtonRegex = /add[ -_]{0,1}((to))[ -_]{0,1}(cart|bag|((wish[ -_]{0,1}){0,1}list))/i;
    return {
        getAddToCartMatches: function (view) {
            var textMatches = elementFinder.findTextNodesWithRegex(view, _addButtonRegex);
            //return textMatches;
            var elementMatches = elementFinder.findDeepestElementsWithRegex(view, _addButtonRegex);
            return {
            	getTextMatches : function() { return textMatches; },
            	getElementMatches : function() { return elementMatches; },
            	hasMatch : function() { 
            		return (textMatches.length && textMatches.length > 0) 
            		|| (elementMatches.length && elementMatches.length > 0);
        		}
           	}
        },
        isProductPage: function(view){
        	var firstMatch = elementFinder.findFirstElementWithRegex(view, _addButtonRegex, true);
        	if(firstMatch)
        		return true;
        	else
        		return false;
        },
        getAddToCartElements : function(view){
        	return elementFinder.findDeepestElementsWithRegex(view, _addButtonRegex, true);
        },
        getProductName: function(document){
        	return document.title;
        }
    }
})(PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder);