var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ENTITIES = PERSONALSHOPPER.ENTITIES || {};

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