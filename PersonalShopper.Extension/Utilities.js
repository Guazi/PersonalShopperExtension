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
    var render = function(view, model){
        return mustache.render(view, model);
    };
    return{
        render : render,
        renderInElement : function(view, model, $element){
            var rendered = render(view, model);
            debug.log(['populated html', rendered]);
            $element.html(rendered);
        }
    }
})(Mustache);

PERSONALSHOPPER.UTILITIES.events = (function($){
    return {
        // pattern taken from Javascript Web Applications
        bind : function(){
            if(!this.o) this.o = $({});
            this.o.bind.apply(this.o, arguments);
        },
        trigger : function(){
            if(!this.o) this.o  = $({});
            this.o.trigger.apply(this.o, arguments);
        }
    };
})(jQuery);