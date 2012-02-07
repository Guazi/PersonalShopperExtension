var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.STRATEGIES = PERSONALSHOPPER.STRATEGIES || {};
var inheritance = inheritance || PERSONALSHOPPER.UTILITIES.inheritance;

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL = PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL || {};
PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.StrategyBase = (function(){
	var Constr = function(){	
	};
	Constr.prototype = {
		getProductInfo : function(){
			
		}	
	};
})();

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.utilities = (function(elementFinder){
    var addButtonRegex = /add[ -_]{0,1}(to)[ -_]{0,1}(shopping){0,1}[ -_]{0,1}(cart|bag|basket|((wish[ -_]{0,1}){0,1}list))/i;
	return {		
		getTitleFromView : function(view){
	    	var titleElements = view.getElementsByTagName('title');
	    	if(titleElements.length > 0)
	    		return titleElements[0].innerText;
			else
				return document.title;
    	},
    	extractSearchTermsFromPageTitle : function(pageTitle){
    		// zappos and tigerirect have at in end - remove everything after at
    		var indexOfAt = pageTitle.indexOf(' at ', 0);
    		var withoutAt = indexOfAt >= 0 ? pageTitle.substr(0, indexOfAt + 1) : pageTitle;
    		var searchTerms = [withoutAt];
			var splitTermsByDelimiter = function(terms, delimiter){
				for(var i = 0, max = terms.length; i < max; i++){
					var splitTerm = terms[i].split(delimiter);
					if(splitTerm.length > 1){
						for(var j = 0, max2 = splitTerm.length; j < max2; j++){
							terms.push(splitTerm[j]);
						}
					}
				}
			}
			splitTermsByDelimiter(searchTerms, ' - ');	
			splitTermsByDelimiter(searchTerms, ': '); // amazon uses this			
			splitTermsByDelimiter(searchTerms, ' at '); // zappos and tigerdirect use this
			debug.log('search terms:');
			for(var i = 0, max = searchTerms.length; i < max; i++){
				debug.log(searchTerms[i]);
			}
			return searchTerms;
		},
        getAddToCartElements : function(view){
        	return elementFinder.findDeepestElementsWithRegex(view, addButtonRegex, true);
        },
        getAllAddToCartMatches: function (view) {
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
        addToCartElementExists : function(view){        	
        	var firstMatch = elementFinder.findFirstElementWithRegex(view, addButtonRegex, true);
        	if(firstMatch)
        		return true;
        	else
        		return false;	
        }        
	};
})(PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder);

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.findProductNearAddToCartButton = (function(productRetrievalUtilities, elementFinder, entities){	
 	var findProductNameTextElement = function(view){
    	var pageTitle = productRetrievalUtilities.getTitleFromView(view);
    	var addToButtonMatches = productRetrievalUtilities.getAddToCartElements(view);
    	var filteredResults = elementFinder.removeFoundElementsByTagName(addToButtonMatches, ['script']);
    	var searchTerms = productRetrievalUtilities.extractSearchTermsFromPageTitle(pageTitle);
    	var textElementMatchWithTitle = elementFinder.findNearestToElementsThatMeetsCondition(filteredResults, 10, function(element){
    		return findFirstTextElementThatMatchesSearchTerms(element, searchTerms);
    	});
    	if(textElementMatchWithTitle){
    		debug.log('found text node with match.  Parent node is:');
    		debug.log(textElementMatchWithTitle.getNode().parentNode);
    		return textElementMatchWithTitle.getNode();
    	}
   },
   findFirstTextElementThatMatchesSearchTerms = function(element, searchTerms){
   		var condition = function(nodeText){
   			var doesMatch = false;
	    	for(var i = 0, max = searchTerms.length; i < max; i++){
	    		doesMatch = elementFinder.doesTextMatch(nodeText, searchTerms[i]);
	    		if(doesMatch){
	    			break;
	    		}
	    	}
	    	return doesMatch;
   		}
   		return elementFinder.findFirstTextWithCondition(element, condition, true);
   };
	return {
		getProductInfo : function(){
			var view = document.body;
			var productNodeTextElement = findProductNameTextElement(view);
        	if(productNodeTextElement){        		
        		var product = new entities.Product(null, productNodeTextElement.nodeValue);
        		return product;
        	} 
		}
	};
})(PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.utilities, PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder, PERSONALSHOPPER.ENTITIES);

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.FindProductBySearch = (function(){
	
})();
