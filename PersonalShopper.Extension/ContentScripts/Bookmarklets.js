var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BOOKMARKLETS = PERSONALSHOPPER.BOOKMARKLETS || {};

PERSONALSHOPPER.BOOKMARKLETS.utilities = (function($, viewEngine){
    var viewTemplates = {
        bookMarkletWrapper : "<div style='position: absolute; z-index: 99999999'>" +
            "<div style='position:relative; background-color: white; border: black; width: 200px;'>"+
            "{{> bodyContents}}" +
            "</div>" +
            "</div>"
    },
    generateBookmarkletHtml = function(model, bookMarkletContents){
        var partials = {bodyContents : bookMarkletContents};
        // render bookm
        var bookMarkletHtml = viewEngine.render(viewTemplates.bookMarkletWrapper, model, partials);
        return bookMarkletHtml;
    },
    generateBookmarkletInView = function($view, bookMarkletContents){
        var bookMarkletHtml = generateBookmarkletHtml(null, bookMarkletContents);
        // add to view and bind to property
        var bookMarklet = document.createElement('div');
        bookMarklet.innerHTML = bookMarkletHtml;
        $view.prepend(bookMarklet);
        return bookMarklet;
    };
    return {
        generateBookmarkletInView  : generateBookmarkletInView
    };
})(jQuery, PERSONALSHOPPER.UTILITIES.viewEngine);

PERSONALSHOPPER.BOOKMARKLETS.ShoppingList = (function(utilities, shoppingListPageConstr){
    var viewTemplates = {
        bookMarkletContents : "<section class='userInformation'>" +
            "<h2>User Information</h2>" +
            "<fieldset class='userInformation'>" +
            "</fieldset>" +
            "</section>" +
            "<section class='shoppingList' />"
    };
    Constr = function($view){
        this.$view = $view;
        this.shoppingListPage = null;
        this.bookMarklet = null;
        this.bookMarkletRendered = false;
    };
    Constr.prototype = {
        showShoppingList : function(userName){
            if(!this.bookMarklet || !this.bookarkletRendered){
                this.bookMarklet = utilities.generateBookmarkletInView(this.$view, viewTemplates.bookMarkletContents);
                this.bookMarkletRendered = true;
            }
            var shoppingListView = $(this.bookMarklet);
            this.shoppingListPage = new shoppingListPageConstr(shoppingListView);
            this.shoppingListPage.init(userName);
        }
    };
    return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilities, PERSONALSHOPPER.CONTROLLERS.ShoppingListPage);