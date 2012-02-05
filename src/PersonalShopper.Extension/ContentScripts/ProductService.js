var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};
PERSONALSHOPPER.REPOSITORIES = PERSONALSHOPPER.REPOSITORIES || {};
PERSONALSHOPPER.ENTITIES = PERSONALSHOPPER.ENTITIES || {};
PERSONALSHOPPER.BUSINESSRULES = PERSONALSHOPPER.BUSINESSRULES || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.ENTITIES.Product = function(id, name, description, price, images, sizes, colors){
	this.id = id,
	this.name = name,
	this.description = description,
	this.price = price,
	this.images = images,
	this.sizes = sizes,
	this.colors = colors;
};
PERSONALSHOPPER.ENTITIES.Image = function(src){
	this.src = src;
};
PERSONALSHOPPER.ENTITIES.Size = function(name){
	this.name = name;
};
PERSONALSHOPPER.ENTITIES.Color = function(name){
	this.name = name;
};

PERSONALSHOPPER.REPOSITORIES.ShopStyleProductRepository = (function(xml2json, entities){
	var findProductWithNameUrl = 'http://api.shopstyle.com/action/apiSearch?pid=uid9600-812360-93&min=0&count=10',
	getProductSearchUrl = function(productName){
		return findProductWithNameUrl + '&fts=' + encodeURI(productName.replace(/ /g, '+').replace(/&/g, '+'));
	}
	parseResponseForProducts = function(xmlString){
		var resultsJson = getResultsJsonFromXml(xmlString);
		debug.log('Results:');
		debug.log(resultsJson);
		var searchResult = resultsJson.SearchResult;
		var products = [];
		if(searchResult){
			var numberOfResults = getNumberOfResults(searchResult.TotalCount);
			if(numberOfResults > 0){
				products = parseProducts(searchResult.Product);
			}
		}
		return products;
	},
	getResultsJsonFromXml = function(xmlString){
		var domParser = new DOMParser();
		var xmlDocument = domParser.parseFromString(xmlString, 'text/xml');	
		var xml2jsonString = xml2json(xmlDocument.firstChild, '');
		return JSON.parse(xml2jsonString);
	},
	getNumberOfResults = function(totalCount){
		if(totalCount)
			return parseInt(totalCount);
		else
			return 0;
	},
	parseProducts = function(productsNode){
		var products = [];
		if(productsNode) {
			if(productsNode.length){
				for(var i = 0, max = productsNode.length; i < max; i++){
					var product = parseProduct(productsNode[i]);
					products.push(product);
				}
			} else
				products.push(parseProduct(productsNode));
		}		
		return products;
	},
	parseProduct = function(productNode){
		var images = parseImages(productNode.Image);
		var sizes = parseSizes(productNode.Size);
		var colors = parseColors(productNode.Color);
		var product = new entities.Product(productNode.Id, 
			productNode.Name, 
			productNode.Description, 
			productNode.Price, 
			images,
			sizes, 
			colors);
		return product;
	},
	parseImages = function(imagesNode){
		var images = [];
		if(imagesNode){
			if(imagesNode.length){
				for(var i = 0, max = imagesNode.length; i < max; i++){
					images.push(parseImage(imagesNode[i]));
				}
			}
			else
				images.push(parseImage(imagesNode));
		}
		return images;
	},
	parseImage = function(imageNode){
		return new entities.Image(imageNode.Url);
	},
	parseSizes = function(sizesNode){
		var sizes = [];
		if(sizesNode){
			if(sizesNode.length){
				for(var i = 0, max = sizesNode.length; i < max; i++){
					sizes.push(parseSize(sizesNode[i]));
				}
			} 
			else
				sizes.push(parseSize(sizesNode));
		}
		return sizes;
	},
	parseSize = function(sizeNode){
		return new entities.Size(sizeNode.Name);
	},
	parseColors = function(colorsNode){
		var colors = [];
		if(colorsNode){
			if(colorsNode.length){
				for(var i = 0, max = colorsNode.length; i < max; i++){
					colors.push(parseColor(colorsNode[i]));
				}
			} 
			else
				colors.push(parseColor(colorsNode));
		}
		return colors;
	},
	parseColor = function(colorNode){
		return new entities.Color(colorNode.Name);		
	};
	return {
		findProductsWithName : function(productName, findProductsResultProcessor){
			var xhr = new XMLHttpRequest();
			var productSearchUrl = getProductSearchUrl(productName);
			var xmlhttp=new XMLHttpRequest();
			debug.log('searching for product: ' + productName);
			xhr.open("GET", productSearchUrl, true);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
			    // JSON.parse does not evaluate the attacker's scripts.
			    var productResults = parseResponseForProducts(xhr.responseText);
			    findProductsResultProcessor.call(null, productResults)
			  }
			}
			xhr.send();
		}
	}
})(xml2json, PERSONALSHOPPER.ENTITIES);

PERSONALSHOPPER.BUSINESSRULES.ProductFilter = (function(){
	var findFirstProductInTerms = function(searchTerms, products){
		var closestProduct;
		var product;
		for(var i = 0, max = products.length; i < max; i++){
			product = products[i];
			if(productIsInTerms(searchTerms, product)){
				closestProduct = product;
				break;
			}
		}
		// return first product if none found
		if(!closestProduct)
			closestProduct = products[0];
		return closestProduct;
	},
	findFirstProductInTerm = function(searchTerm, products){
		var productLength = products.length;
		if(productLength <= 0)
			return;
		else {
			var productMatch = null;
			for(var i = 0, max = productLength; i < max; i++){
				var product = products[i];
				if(isMatch(searchTerm, product.name)){
					productMatch = product;
					break;
				}
			}
			return productMatch;
		}
	},
	productIsInTerms = function(searchTerms, product){
		var isInTerms = false;
		for(var i = 0, max = searchTerms.length; i < max; i++){
			if(isMatch(searchTerms[i], product.name)){
				isInTerms = true;
				break;
			}
		}		
		return isInTerms;
	},
	isMatch = function(container, toMatch){
		var containerStripped = container.replace(/ /g, '').toLowerCase();
		var toMatchStripped = toMatch.replace(/ /g, '').toLowerCase();
		debug.log('seeing if ' + containerStripped + ' is match with ' + toMatchStripped);
		var regExp = new RegExp(containerStripped);
		var isMatched = regExp.test(toMatchStripped);
		debug.log('is matched? ' + isMatched);
		return isMatched;		
	};
	return {
		findFirstProductInTerms : findFirstProductInTerms,
		findFirstProductInTerm : findFirstProductInTerm,
		isMatch : isMatch
	};
})();

PERSONALSHOPPER.SERVICES.ProductSearch = (function(productRepository, productFilter){
	var extractSearchTerms = function(productName){
		var searchTerms = [productName];
		var secondTerms = productName.split(' - ');
		for(var i = secondTerms.length - 1; i >= 0; i--){
			searchTerms.push(secondTerms[i]);
		}
		return searchTerms;
	},
	searchForProductInftoRef = function(searchTerms, currentTermIndex, productSearchResultProcessor, currentResultsRef){
		var searchTerm = searchTerms[currentTermIndex];
		productRepository.findProductsWithName(searchTerm, function(productSearchResults){
			var actualCurrentResultRef = currentResultsRef || [];
			processSearchResultIntoRef(productSearchResults, searchTerms, currentTermIndex, productSearchResultProcessor, actualCurrentResultRef);
		});		
	},
	processSearchResultIntoRef = function(productSearchResults, searchTerms, currentTermIndex, productSearchResultProcessor, currentResultsRef){
		currentResultsRef.push(productSearchResults);			
		if(currentTermIndex >= searchTerms.length - 1)
			// end case - at last term - call result processor
			productSearchResultProcessor.apply(null, [searchTerms, currentResultsRef]);
		else
			// recursive case, get next product results
			searchForProductIntoRef(searchTerms, currentTermIndex + 1, productSearchResultProcessor, currentResultsRef);
	},
	searchForProduct = function(searchTerms, currentTermIndex, productSearchResultProcessor){
		var searchTerm = searchTerms[currentTermIndex];
		productRepository.findProductsWithName(searchTerm, function(productSearchResults){
			processSearchResult(productSearchResults, searchTerm, searchTerms, currentTermIndex, productSearchResultProcessor);
		});		
	},
	processSearchResult = function(productSearchResults, currentSearchTerm, searchTerms, currentTermIndex, productSearchResultProcessor){
		var firstProductInTerm = productFilter.findFirstProductInTerm(currentSearchTerm, productSearchResults);
		if(firstProductInTerm)
			// end case - call result processor			
			productSearchResultProcessor.call(null, firstProductInTerm);
		 else if(currentTermIndex >= searchTerms.length - 1)
			// end case - at last term - call result processor with no result
			productSearchResultProcessor.call();
		else
			// recursive case, get next product results
			searchForProduct(searchTerms, currentTermIndex + 1, productSearchResultProcessor);
	};
	return {
		findFirstProductWithName : function(productName, productSearchResultProcessor){
			var searchTerms = extractSearchTerms(productName);
			searchForProduct(searchTerms, 0, productSearchResultProcessor);
		},
		findAllProductsInSearchTerm : function(searchTerm, productSearchResultProcessor){
			var searchTerms = extractSearchTerms(productName);
			searchForProductInftoRef(searchTerms, 0, productSearchResultProcessor);
		},
		extractSearchTerms : extractSearchTerms
	};
})(PERSONALSHOPPER.REPOSITORIES.ShopStyleProductRepository, PERSONALSHOPPER.BUSINESSRULES.ProductFilter);

PERSONALSHOPPER.SERVICES.ProductRetrieval = (function(productSearch, productFilter){
	var findFirstMatchUsingSearchTerms = function(searchTerms, currentIndex, productRetrievalResultProcessor){
		if(currentIndex >= searchTerms.length){
			// end case, call result processor with null product
			productRetrievalResultProcessor.call();
		} else {
			productSearch.findAllProductsInSearchTerm(searchTerms[currentIndex], function(products){
				var bestProduct = productFilter.findFirstProductInTerms(searchTerms, products);
				if(bestProduct != null)
					// end case, call result processor with found product
					productRetrievalResultProcessor.call(null, bestProduct);
				else
					// resursive case
					findFirstMatchUsingSearchTerms(searchTerms, currentIndex + 1, productRetrievalResultProcessor);
			});
		}
		
	},
	findFirstProduct = function(productName, productRetrievalResultProcessor){
		productSearch.findFirstProductWithName(productName, function(product){
			productRetrievalResultProcessor.call(null, product);
		});
	};
	return {
		findProductInfo : function(productName, productRetrievalResultProcessor){
			findFirstProduct(productName, productRetrievalResultProcessor);
		}
	};
})(PERSONALSHOPPER.SERVICES.ProductSearch, PERSONALSHOPPER.BUSINESSRULES.ProductFilter);
