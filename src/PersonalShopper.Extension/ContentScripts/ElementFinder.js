var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTENTSCRIPTS = PERSONALSHOPPER.CONTENTSCRIPTS || {};

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
		//console.log("Logging matches.");
    	while (currentNode = walkerIterator.nextNode()) {
    		nodeIsMatch = isMatch(currentNode, regex);
    		//console.log(currentNode);
    		//console.log(nodeIsMatch);
    		if(nodeIsMatch ){
    			firstMatch = currentNode;
    			break;
    		}
    	}
    	//console.log("End logging matches.");
		return firstMatch;
   	},
    isMatch = function(node, regex){
    	var textToMatch = node.nodeType == 3? node.nodeValue : node.outerHTML;
    	var regexMatches = textToMatch.match(regex);
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
	}
	log = function(toLog){
		if(config.debug){
			console.log(toLog);
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
        findTextNodesWithRegex: function (view, regex) {
        	
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
        findDeepestElementsWithRegex: function(view, regex){
        	var walkerIterator = createWalkerIterator(view, NodeFilter.SHOW_ELEMENT);
            foundElements = getDeepestMatches(regex, walkerIterator);
            
            return foundElements;    	
        },
    }

})({debug:true}, PERSONALSHOPPER.CONTENTSCRIPTS.foundElement);

PERSONALSHOPPER.CONTENTSCRIPTS.foundElementNodeList = (function(){
	var Const = function(rootFoundElement){
		var rootFoundElement = rootFoundElement;
								
	};
	return Const;	
})();
