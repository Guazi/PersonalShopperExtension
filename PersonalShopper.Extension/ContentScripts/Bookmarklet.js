var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTROLLERS = PERSONALSHOPPER.CONTROLLERS || {};

PERSONALSHOPPER.CONTROLLERS.Bookmarklet = (function($, viewEngine, shoppingListPageConstr){
    var viewTemplates = {
        bookMarkletWrapper : "<div style=\"position: 'absolute', 'z-index': 99999999, top: topOffset, right: rightOffset\">" +
            "<section>" +
            "<h2>User Information</h2>" +
            "<fieldset class='userInformation'>" +
            "</fieldset>" +
            "</section>" +
            "<section class='shoppingList' />" +
        "</div>"
    },
    generateBookmarkletView = function($view){
        var model = {content : viewTemplates.bookMarkletContent};
        var bookMarkletHtml = viewEngine.render(viewTemplates.bookMarkletWrapper, model);
        // add to view and bind to property
        var bookMarklet = document.createElement('div');
        bookMarklet.innerHTML = bookMarkletHtml;
        $view.prepend(bookMarklet);
        return bookMarklet;
    },
    Constr = function($view){
        this.$view = $view;
        this.shoppingListPage = null;
        this.bookMarklet = null;
        this.bookMarkletRendered = false;
    };
    Constr.prototype = {
        showShoppingList : function(userName){
            if(!this.bookMarklet || !this.bookarkletRendered){
                this.bookMarklet = generateBookmarkletView(this.$view);
                this.bookMarkletRendered = true;
            }
            var shoppingListView = $(this.bookMarklet);
            this.shoppingListPage = new shoppingListPageConstr(shoppingListView);
            this.shoppingListPage.init(userName);
        }
    };
    return Constr;
})(jQuery, PERSONALSHOPPER.UTILITIES.viewEngine, PERSONALSHOPPER.CONTROLLERS.ShoppingListPage);