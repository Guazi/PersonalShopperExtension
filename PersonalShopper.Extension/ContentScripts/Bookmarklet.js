var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTROLLERS = PERSONALSHOPPER.CONTROLLERS || {};

PERSONALSHOPPER.CONTROLLERS.Bookmarklet = (function(shoppingListPageConstr){
    var viewTemplates = {
        bookMarkletWrapper : "<div style='position: 'absolute', 'z-index': 99999999, top: topOffset, right: rightOffset>" +
            "{{contents}}</div>"
    },
    Constr = function($view){
        this.$view = $view;
        this.shoppingListPage = new shoppingListPageConstr(this.$view);
    };
    Constr.prototype = {
        showShoppingList : function(){
            var self = this;

        }
    };
    return Constr;
})(PERSONALSHOPPER.CONTROLLERS.ShoppingListPage);