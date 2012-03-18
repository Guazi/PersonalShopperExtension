var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTROLLERS = PERSONALSHOPPER.CONTROLLERS  || {};

PERSONALSHOPPER.CONTROLLERS.SaveForLater = (function(viewEngine){
    var viewTemplates = {
        productView : "<h2>Save for Later</h2>" +
            "<h3>{{name}}</h3>",
        noProductView :
            "<h2>No Product Found on Page</h2>"
    },
    Constr = function($view){
        this.$view = $view.find('section');
    };
    Constr.prototype = {
        init : function(){
        },
        openSaveForLater : function(product){
            if(product)
                viewEngine.renderInElement(viewTemplates.productView, product, this.$view);
            else
                viewEngine.renderInElement(viewTemplates.noProductView, null, this.$view);
        }
    };
    return Constr;
})(PERSONALSHOPPER.UTILITIES.viewEngine);