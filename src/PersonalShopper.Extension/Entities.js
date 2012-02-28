var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ENTITIES = PERSONALSHOPPER.ENTITIES || {};

PERSONALSHOPPER.ENTITIES.Product = function(id, productUrl, name, description, price, images, sizes, colors){
	this.id = id,
    this.productUrl = productUrl,
	this.name = name,
	this.description = description,
	this.price = price,
	this.images = images,
	this.sizes = sizes,
	this.colors = colors;
};

/**
 * Creates new product with projection of other product onto this one.  This
 * product's properties take precendence if they have been assigned already
 */
//PERSONALSHOPPER.ENTITIES.Product.prototype.merge = function(product){
//	return new PERSONALSHOPPER.ENTITIES.Product(evaluation.notNullValue(this.id, product.id));
//}
PERSONALSHOPPER.ENTITIES.Image = function(src){
	this.src = src;
};
PERSONALSHOPPER.ENTITIES.Size = function(name){
	this.name = name;
};
PERSONALSHOPPER.ENTITIES.Color = function(name){
	this.name = name;
};