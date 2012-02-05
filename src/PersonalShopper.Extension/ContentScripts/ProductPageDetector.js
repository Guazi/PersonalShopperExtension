/// <reference path="~/Utilities.js" />

var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ADDTOLIST = PERSONALSHOPPER.ADDTOLIST || {};

PERSONALSHOPPER.ADDTOLIST.productPageDetector = (function (elementFinder, productSearch, entities) {
	// dependencies
    var elementFinder = elementFinder,
    // constants
    addButtonRegex = /add[ -_]{0,1}((to))[ -_]{0,1}(cart|bag|((wish[ -_]{0,1}){0,1}list))/i,
    getTitleFromView = function(view){
    	var titleElements = view.getElementsByTagName('title');
    	if(titleElements.length > 0)
    		return titleElements[0].innerText;
		else
			return document.title;
    },
    findProductNameTextElement = function(view){
    	var pageTitle = getTitleFromView(view);
    	var addToButtonMatches = elementFinder.findDeepestElementsWithRegex(view, addButtonRegex);
    	var filteredResults = elementFinder.removeFoundElementsByTagName(addToButtonMatches, ['script']);
    	var searchTerms = productSearch.extractSearchTerms(pageTitle);
    	var textElementMatchWithTitle = elementFinder.findNearestTextNodeToElementsBySearchTerms(filteredResults, searchTerms, 10);
    	if(textElementMatchWithTitle){
    		console.log('found text node with match.  Parent node is:');
    		console.log(textElementMatchWithTitle.getNode().parentNode);
    		return textElementMatchWithTitle.getNode();
    	}
    };
    return {
        getAddToCartMatches: function (view) {
            var textMatches = elementFinder.findTextNodesWithRegex(view, addButtonRegex);
            //return textMatches;
            var elementMatches = elementFinder.findDeepestElementsWithRegex(view, addButtonRegex);
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
        	var firstMatch = elementFinder.findFirstElementWithRegex(view, addButtonRegex, true);
        	if(firstMatch)
        		return true;
        	else
        		return false;
        },
        getAddToCartElements : function(view){
        	return elementFinder.findDeepestElementsWithRegex(view, addButtonRegex, true);
        },
        getProductName: function(view){
        	return getTitleFromView(view);
        },
        scrapeForProductInfo : function(view){
        	var productNodeTextElement = findProductNameTextElement(view);
        	if(productNodeTextElement){
        		
        		var product = new entities.Product(null, productNodeTextElement.nodeValue);
        		return product;
        	}        	
        }
    }
})(PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder, PERSONALSHOPPER.SERVICES.ProductSearch, PERSONALSHOPPER.ENTITIES);