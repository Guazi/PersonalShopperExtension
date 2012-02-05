var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.UTILITIES = PERSONALSHOPPER.UTILITIES || {};

PERSONALSHOPPER.UTILITIES.debug = (function(config){
	return {
		log : function(toLog){
			if(config.debug){
				console.log(toLog);
			}
		}
	}	
})({debug:true});

PERSONALSHOPPER.UTILITIES.inheritance = (function(config){
	return {
		inheritPrototype : function(child, parent){
			child.prototype = new parent();	
		}
	}
})();
