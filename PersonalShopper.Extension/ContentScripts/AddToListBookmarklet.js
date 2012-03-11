var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BOOKMARKLETS = PERSONALSHOPPER.BOOKMARKLETS || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.BOOKMARKLETS.utilites = (function(){
	var appendStyleAttributes = function(element, attributes){
		var newStyleString = '';
		for(var style in attributes){
			if(attributes.hasOwnProperty(style)){
				element.style.setProperty(style, attributes[style]);
			}
		}	
	}, 
	appendStyle = function(element, styleString){
		
	};
	return {
		createViewPortPoisitionedElement : function(tagName, topOffset, rightOffset){
			var element = document.createElement(tagName);
			var styleAttributes = {
				position: 'absolute', 
				'z-index': 99999999, 
				top: topOffset, 
				right: rightOffset
			};
			appendStyleAttributes(element, styleAttributes);
			return element;
		},
		appendStyleAttributes : appendStyleAttributes,		
		// addEvent and removeEvent copied from http://ejohn.org/projects/flexible-javascript-events/
		addEvent : function ( obj, type, fn ) {
		  if ( obj.attachEvent ) {
		    obj['e'+type+fn] = fn;
		    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
		    obj.attachEvent( 'on'+type, obj[type+fn] );
		  } else
		    obj.addEventListener( type, fn, false );
		},
		removeEvent : function( obj, type, fn ) {
		  if ( obj.detachEvent ) {
		    obj.detachEvent( 'on'+type, obj[type+fn] );
		    obj[type+fn] = null;
		  } else
		    obj.removeEventListener( type, fn, false );
		},
		createImageElement : function(src){
			var imageElement = document.createElement('img');
			imageElement.setAttribute('src', src);
			return imageElement;	
		},
		createTextWrapper : function(tag, text){
			var wrapper = document.createElement(tag);
			wrapper.innerText = text;
			return wrapper;
		},
		createRawHtmlWrapper : function(tag, html){
			var wrapper = document.createElement(tag);
			wrapper.innerHTML = html;
			return wrapper;
		}
	};
})();

PERSONALSHOPPER.BOOKMARKLETS.addToListWindow = (function(utilities, productRetrieval){
	var Constr = function (documentBody){
		this.documentBody = documentBody;
		this.product = null;
		this.loadingNode = null;
		this.bookmarketWrapper = null;
	},
	setTitle = function(title, bookmarkletWrapper){
		var titleNode = utilities.createTextWrapper('h2', title);
		bookmarkletWrapper.appendChild(titleNode);
	},
	setSubTitle = function(title, bookmarkletWrapper){
		var titleNode = utilities.createTextWrapper('h3', title);
		bookmarkletWrapper.appendChild(titleNode);
	},
	setDescription = function(description, bookmarkletWrapper){
		var descriptionNode = utilities.createRawHtmlWrapper('span', description);
		bookmarkletWrapper.appendChild(utilities.createTextWrapper('h4', 'description'));
		bookmarkletWrapper.appendChild(descriptionNode);
	},
	setProductImages = function(imageEntities, bookmarkletWrapper){
		if(imageEntities && imageEntities.length > 0){
			var ul = document.createElement('ul');
			for(var i = 0, max = imageEntities.length; i < max; i++){
				var li = document.createElement('li');
				li.appendChild(utilities.createImageElement(imageEntities[i].src));
				ul.appendChild(li);
			}
			var header = utilities.createTextWrapper('h4', 'Images');
			bookmarkletWrapper.appendChild(header);
			bookmarkletWrapper.appendChild(ul);
		}
	},
	setProductSizes = function(sizeEntities, bookmarkletWrapper){
		if(sizeEntities && sizeEntities.length > 0){
			var ul = document.createElement('ul');
			for(var i = 0, max = sizeEntities.length; i < max; i++){
				var li = utilities.createTextWrapper('li', sizeEntities[i].name);
				ul.appendChild(li);
			}
			var header = utilities.createTextWrapper('h4', 'Sizes');
			bookmarkletWrapper.appendChild(header);
			bookmarkletWrapper.appendChild(ul);
		}
	},
	setProductColors = function(colorEntities, bookmarkletWrapper){
		if(colorEntities && colorEntities.length > 0){
			var ul = document.createElement('ul');
			for(var i = 0, max = colorEntities.length; i < max; i++){
				var li = utilities.createTextWrapper('li', colorEntities[i].name);
				ul.appendChild(li);
			}
			var header = utilities.createTextWrapper('h4', 'Colors');
			bookmarkletWrapper.appendChild(header);
			bookmarkletWrapper.appendChild(ul);
		}
	};
	Constr.prototype = {
		constructor : PERSONALSHOPPER.BOOKMARKLETS.addToListWindow,
		openAndLoadProduct : function(product){	
			this.bookmarkletWrapper = utilities.createViewPortPoisitionedElement('div', '5px', '5px');
			utilities.appendStyleAttributes(this.bookmarkletWrapper, {
				'background-color':'white',
				'border':'black 1px solid',
				width: '300px',//,
				'text-align' : 'left'
				//height: '400px'
			});
			this.documentBody.appendChild(this.bookmarkletWrapper);
			this.displayProduct(product);
		},
		displayProduct : function(product){
			if(!product)
				setTitle('No product found', this.bookmarkletWrapper);
			else{
				this.product = product;
				setTitle('Save for Later', this.bookmarkletWrapper);
				setSubTitle(product.name, this.bookmarkletWrapper);
				setDescription(product.description, this.bookmarkletWrapper);
				setProductImages(product.images, this.bookmarkletWrapper);
				setProductSizes(product.sizes, this.bookmarkletWrapper);
				setProductColors(product.colors, this.bookmarkletWrapper);
			}
		}
	};
	return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilites);

PERSONALSHOPPER.BOOKMARKLETS.addToListPrompter = (function(utilities){
	var Constr = function(documentBody, productTitle){
		this.documentBody = documentBody;
		this.productTitle = productTitle;
		this.bookmarkletWrapper = null;		
	}, 
	createPromptSaveForLaterButton = function(openAddToListWindowFunction){
		var link = document.createElement('a');		
		link.href = "#saveForLater";
		utilities.addEvent(link, 'click', openAddToListWindowFunction);
		link.appendChild(document.createTextNode('Save for Later'));	
		return link;	
	};
	Constr.prototype = {
		constructor: PERSONALSHOPPER.BOOKMARKLETS.addToListPrompter,
		promptToAddToList : function(openAddToListWindowFunction){
			//alert(this.productTitle);)
			this.bookmarkletWrapper = utilities.createViewPortPoisitionedElement('div', 0, 0);
			var promptSaveForLateButton = createPromptSaveForLaterButton (openAddToListWindowFunction);
			this.bookmarkletWrapper.appendChild(promptSaveForLateButton);
			this.documentBody.appendChild(this.bookmarkletWrapper);		
		},
		closePromptToAddToList: function(){
			if(this.bookmarkletWrapper)
				this.documentBody.removeChild(this.bookmarkletWrapper);
		}
	}
	return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilites);
