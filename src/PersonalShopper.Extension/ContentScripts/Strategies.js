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
    var addButtonRegex = /add[ -_]{0,1}(to)[ -_]{0,1}(shopping){0,1}[ -_]{0,1}(cart|bag|basket|((wish[ -_]{0,1}){0,1}list))/i,
        getMetaElementsWithName = function(view, metaNames){
            var metaElements = view.getElementsByTagName('meta');
            for(var i = 0, max = metaNames.length; i < max; i++){
                //var metaName
            }
        };
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
            splitTermsByDelimiter(searchTerms, ' | '); // gap uses this
            splitTermsByDelimiter(searchTerms, '. '); // cole haan uses this
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
	var sizeRegex = /size/i,
    colorRegex = /color/i,
 	findProductNameTextElement = function(view){
    	var pageTitle = productRetrievalUtilities.getTitleFromView(view);
    	var addToButtonMatches = productRetrievalUtilities.getAddToCartElements(view);
    	var filteredResults = elementFinder.removeFoundElementsByTagName(addToButtonMatches, ['script']);
    	var searchTerms = productRetrievalUtilities.extractSearchTermsFromPageTitle(pageTitle);
    	var textElementMatchWithTitle = elementFinder.findNearestToElementsThatMeetsCondition(filteredResults, 10, function(element){
    		return findFirstTextElementThatMatchesSearchTerms(element, searchTerms);
    	});
    	if(textElementMatchWithTitle){
    		debug.log(['found text node with match.  Parent node is:' ,textElementMatchWithTitle.nearestElementWithCondition.parentNode]);
            debug.log(['button found near is:', textElementMatchWithTitle.elementFoundNear]);
    		return textElementMatchWithTitle;
    	}
   },
   findSizesWithinNode = function(node){
   		var sizeElement = findFirstTextElementThatMatchesSearchTerms(node, [sizeRegex]);
   		if(sizeElement){
   			debug.log('found size node. parent node is:');
   			debug.log(sizeElement.parentNode);
   		}
   },
   findColorsWithinNode = function(node){
       var colorElement = findFirstTextElementThatMatchesSearchTerms(node, [colorRegex]);
       if(colorElement){
           debug.log('found color node. parent node is:');
           debug.log(colorElement.parentNode);
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
		getProductInfo : function(existingProductInfo){
			var view = document.body;
			var productNameTextElement = findProductNameTextElement(view);
        	if(productNameTextElement){
                var productInfoWrapper = productNameTextElement.wrapperNode;
                debug.log(['Product info wrapper:',productInfoWrapper]);
                if(productInfoWrapper){
                    var sizes = findSizesWithinNode(productInfoWrapper);
                    var colors = findColorsWithinNode(productInfoWrapper);
                }
        		var product = new entities.Product(null, productNameTextElement.nearestElementWithCondition.nodeValue);
        		return product;
        	} 
		}
	};
})(PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.utilities, PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder, PERSONALSHOPPER.ENTITIES);

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.findProductBySearch = (function(utilities, productRetrieval){
	var processProductResult = function(existingProduct, retrievedProduct){
		if(retrievedProduct){
			if(!existingProduct.id)
				existingProduct.id = retrievedProduct.id;
		}
		return existingProduct;
	};
	return {
		getProductInfo : function(existingProductInfo){
			var view = document.body;
			var productName = existingProductInfo.name ? existingProductInfo.name : utilities.getTitleFromView(view);
			var finalProduct;
			productRetrieval.findProductInfo(productName, function(product){
				finalProduct = processProductResult(existingProductInfo, product)
			});
			return finalProduct;
		}
	}
})(PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.utilities, PERSONALSHOPPER.SERVICES.productRetrieval);

PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL.findProductByScrapeThenSearch = (function(productRetrieval){
	return {
		getProductInfo : function(existingProductInfo){
			var scrapedProductInfo = productRetrieval.findProductNearAddToCartButton.getProductInfo(existingProductInfo);
			// todo: below results in async callback - need to figure out how to actually return a value.
			var enhancedWithSearch = productRetrieval.findProductBySearch.getProductInfo(scrapedProductInfo);
			return enhancedWithSearch;
		}
	}
})(PERSONALSHOPPER.STRATEGIES.PRODUCTRETRIEVAL);
