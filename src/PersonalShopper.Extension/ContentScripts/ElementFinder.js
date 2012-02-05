var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTENTSCRIPTS.foundElement = (function () {
    var Constr = function (node, matches) {
        var node = node;
        return {
            getNode: function () { return node },
        };
    };
    return Constr;
})();

PERSONALSHOPPER.CONTENTSCRIPTS.elementFinder = (function (config, foundElement) {
    // constants
    var config = config,
    maxTreeWalkerSearch = 2000,
    createWalkerIterator = function(targetNode, whatToShow){
    	var index = 0,
    	walker = document.createTreeWalker(
                targetNode,
                whatToShow,
                null,
                false
          );
        return {
        	nextNode : function (){ 
        		if(index >= maxTreeWalkerSearch)
        			return null;
    			else {
    				var node = walker.nextNode();
    				index = index + 1;
    				return node;
    			}
        	},
        	parentNode: function(){
        		return walker.parentNode();
        	}
        };
    },
    findFirstMatch = function(regex, walkerIterator){
		var firstMatch = null;    	
		// keep traversing until find a match.
		var currentNode;
		var nodeIsMatch;
		//debug.log("Logging matches.");
    	while (currentNode = walkerIterator.nextNode()) {
    		nodeIsMatch = isMatch(currentNode, regex);
    		//debug.log(currentNode);
    		//debug.log(nodeIsMatch);
    		if(nodeIsMatch ){
    			firstMatch = currentNode;
    			break;
    		}
    	}
    	//debug.log("End logging matches.");
		return firstMatch;
   	},
   	findTextNodesWithRegex = function (view, regex) {  	
    	var walkerIterator = createWalkerIterator(view, NodeFilter.SHOW_TEXT);

        var node;
        var foundElements = [];

		var node;
        while (node = walkerIterator.nextNode()) {
            var regexMatches = isMatch(node, regex);
            if (regexMatches && regexMatches.length > 0) {
                var found = new foundElement(node, regexMatches);
                foundElements.push(found);
            }
        }

        return foundElements;
    },  	
   	findNearestToElementThatMatchesCondition = function(element, currentDistance, maxDistance, getElementWithConditionFunction){
   		if(currentDistance >= maxDistance)
   			// end case
   			return;
		else
		{
			var parentNode = element.parentNode;
			if(!parentNode)
				// end case - no more parents
				return;
			else {
				debug.log('searching in');
				debug.log(parentNode);
				var elementWithCondition = getElementWithConditionFunction(parentNode);
				if(elementWithCondition)
					// end case - match found
					return elementWithCondition;	
				else
					// recursive case - find on parent
					return findNearestToElementThatMatchesCondition(parentNode, currentDistance + 1, maxDistance, getElementWithConditionFunction);
			}
		}
   	},
    isMatch = function(node, regex){
    	var textToMatch = node.nodeType == 3? node.nodeValue : node.outerHTML;
    	return doesTextMatch(textToMatch, regex);
    },
    doesTextMatch = function(textToMatch, regex){
    	var regexMatches;
    	try{
    		regexMatches = textToMatch.match(regex);	
    	}catch(e){
    		// if fails because cannot parse regex, return false, otherwise, let error bubble out
    		if(e.type == 'malformed_regexp'){
    			return false;
    		}
    		else
    			throw e;
    	}
    	return regexMatches && regexMatches.length > 0;
    },
    getDeepestMatches = function(regex, walkerIterator, excludeScriptsInResults){
		var firstMatch = findFirstMatch(regex, walkerIterator);
		if(firstMatch){			
			return getNextDeepestMatches(firstMatch, regex, walkerIterator, excludeScriptsInResults);
		} else return [];
		return deepestMatches;
	},
	getNextDeepestMatches = function(currentMatch, regex, walkerIterator, excludeScriptsInResults){
    	var nextMatch = findFirstMatch(regex, walkerIterator);
		if(!nextMatch){
			log("No more matches");
			// no more matches - end case - this is the only element that matches so return it in array
			if(shouldAddElement(currentMatch, excludeScriptsInResults)){
            	var found = new foundElement(currentMatch);
            	return [found];
            }
        	else
        		return [];
		} else {
			// recursive case
			// this is the deepest match if the next matche's parent node is not this item.
			var isDeepestMatch = nextMatch.parentNode != currentMatch;
			// do recursive call now on the next match, and get it's matches
			var nextDeepestMatches = getNextDeepestMatches(nextMatch, regex, walkerIterator, excludeScriptsInResults);
			// if this is the deepest match, add it to the list of found from recurisve call
			if(isDeepestMatch) {
				if(shouldAddElement(currentMatch, excludeScriptsInResults)){
            		var found = new foundElement(currentMatch);
					nextDeepestMatches.push(found);
				}				
			}
			return nextDeepestMatches;
		}
	},
	shouldAddElement = function(node, excludeScriptsInResults){
		return !(excludeScriptsInResults && node.tagName == 'SCRIPT');
	},
	log = function(toLog){
		if(config.debug){
			debug.log(toLog);
		}
	};
    return {
    	findFirstElementWithRegex: function(view, regex, excludeScriptsInResults){
    		var walkerIterator = createWalkerIterator(view, NodeFilter.SHOW_ELEMENT);
    		var foundElements = getDeepestMatches(regex, walkerIterator, excludeScriptsInResults);
    		if(foundElements.length > 0){
    			log('found a match.  it is:');
    			log(foundElements[0].getNode());
    			return foundElements[0];
			}
			else
    			return null;
    	},
        findTextNodesWithRegex : findTextNodesWithRegex,        
        findDeepestElementsWithRegex: function(view, regex){
        	var walkerIterator = createWalkerIterator(view, NodeFilter.SHOW_ELEMENT);
            foundElements = getDeepestMatches(regex, walkerIterator);
            
            return foundElements;    	
        },
        findNearestToElementsThatMeetsCondition: function(elements, maxDistance, getElementWithConditionFunction){
        	var nearestElementWithCondition = null;
        	for(var i = 0, max = elements.length; i < max; i++){
        		var elementWithCondition = findNearestToElementThatMatchesCondition(elements[i].getNode(), 0, maxDistance, getElementWithConditionFunction);
        		if(elementWithCondition){
        			nearestElementWithCondition = elementWithCondition;
        			break;
        		}
        	}
        	return nearestElementWithCondition;
        },
        removeFoundElementsByTagName : function(foundElements, tagNamesToExclude){
        	var filteredResult = [];
        	for(var i = 0, max = foundElements.length; i < max; i++){
        		var foundElement = foundElements[i];
        		var tagName = foundElement.getNode().tagName;
        		var exclude = false;
        		for(var j = 0, tagNamesMatch = tagNamesToExclude.length; j < tagNamesMatch; j++){
        			if(tagName.toLowerCase() == tagNamesToExclude[j]){
        				exclude = true;
        				break;
        			}
        		}
        		if(!exclude)
        			filteredResult.push(foundElement);
        	}
        	return filteredResult;
        },
        findFirstTextWithCondition : function(view, condition){
	   		var walkerIterator = createWalkerIterator(view, NodeFilter.SHOW_TEXT);
	
	        var node;
	        var found;
	
			var node;
	        while (textNode = walkerIterator.nextNode()) {
	        	var nodeText = textNode.nodeValue;
	        	if(nodeText && nodeText.length > 3){
	        		var meetsCondition = condition(nodeText);
		            if (meetsCondition) {
		                found = new foundElement(textNode);
		                break;
		            }
	           	}
	        }
	
	        return found;
	   	}, 
	   	doesTextMatch : doesTextMatch
    }

})({debug:true}, PERSONALSHOPPER.CONTENTSCRIPTS.foundElement);

PERSONALSHOPPER.CONTENTSCRIPTS.foundElementNodeList = (function(){
	var Const = function(rootFoundElement){
		var rootFoundElement = rootFoundElement;
								
	};
	return Const;	
})();
