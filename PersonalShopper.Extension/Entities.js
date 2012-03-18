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

PERSONALSHOPPER.ENTITIES.Image = function(src, width, height, alt){
	this.src = src;
    this.width = width;
    this.height = height;
    this.alt = alt;
};
PERSONALSHOPPER.ENTITIES.Size = function(name){
	this.name = name;
};
PERSONALSHOPPER.ENTITIES.Color = function(name){
	this.name = name;
};