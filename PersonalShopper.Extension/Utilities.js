var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.UTILITIES = PERSONALSHOPPER.UTILITIES || {};

PERSONALSHOPPER.UTILITIES.debug = (function(config){
	return {
		log : function(toLog){
            if(config.debug){
                if(toLog.length && (typeof toLog != 'string')){
                    for(var i = 0, max = toLog.length; i < max; i++){
                        console.log(toLog[i]);
                    }
                }
                else
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

PERSONALSHOPPER.UTILITIES.evaluation = (function(debug){
	return {
		notNullValue : function(a, b){
			if(a) return a; 
			else return b;	
		},
        isSubSet: function(a, b){
            var isSubSet = true;
            for(var i = 0, max = a.length; i < max; i++){
                var setContains = false;
                var toSeeIfContains = a[i];
                for(var j = 0, maxInSet = b.length; j < maxInSet; j++){
                    if(toSeeIfContains == b[j]){
                        setContains = true;
                        break;
                    }
                }
                if(!setContains){
                    debug.log(['Set does not contain:',toSeeIfContains])
                    isSubSet = false;
                    return isSubSet;
                }
            }
        }
	}
})(PERSONALSHOPPER.UTILITIES.debug);

PERSONALSHOPPER.UTILITIES.serviceClient = (function(){
    var buildJsonPostBodyFromValues = function(postData){
        var postBody = JSON.stringify(postData);
        return postBody;
    };
    return {
        asyncGet : function(url, callback){
            var xhr=new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    callback(xhr.responseText);
                }
            }
            xhr.send();
        },
        asyncPostJson : function(url, method, postData, callback){
            var xhr=new XMLHttpRequest();
            xhr.open(method, url, true);
            var postBody = buildJsonPostBodyFromValues(postData);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(postBody);
        },
        isNullResponse : function(data){
           var isNull = !data || data === 'null';
           return isNull;
        }
    };
})();

// wrapper around local storage
PERSONALSHOPPER.UTILITIES.userStorage = (function(){
    return {
        setItem : function(key, value){
            localStorage.setItem(key, value);
        },
        getItem : function(key){
            return localStorage.getItem(key);
        }
    }
})();

PERSONALSHOPPER.UTILITIES.viewEngine = (function(mustache){
    var render = function(view, model, partials){
        return mustache.render(view, model, partials);
    };
    return{
        render : render,
        renderInElement : function(viewTemplate, model, $element){
            var rendered = render(viewTemplate, model);
            debug.log(['populated html', rendered]);
            $element.html(rendered);
        }
    }
})(Mustache);

PERSONALSHOPPER.UTILITIES.eventBroker = (function(){
    var eventsByName = [];
    return {
        bind : function(eventName, callback){
            var eventsForName = eventsByName[eventName];
            if(!eventsForName)
                eventsForName = eventsByName[eventName] = [];
            eventsForName.push(callback);
            // todo: add to chrome global events?
        },
        fire : function(eventName, data){
            var eventForName = eventsByName[eventName];
            if(eventForName){
                for(var i = 0, max = eventForName.length ; i < max; i++){
                    eventForName[i](data);
                }
            }
        }
    }
})();

PERSONALSHOPPER.UTILITIES.Events = (function($){
    var Constr = function($element){
        this.$element = $element;
    };
    Constr.prototype = {
        // pattern taken from Javascript Web Applications
        bind : function(){
            this.$element.bind.apply(this.$element, arguments);
        },
        trigger : function(){
            this.$element.trigger.apply(this.$element, arguments);
        }
    };
    return Constr;
})(jQuery);