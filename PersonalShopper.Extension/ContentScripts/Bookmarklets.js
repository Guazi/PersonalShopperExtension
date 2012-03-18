var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BOOKMARKLETS = PERSONALSHOPPER.BOOKMARKLETS || {};

PERSONALSHOPPER.BOOKMARKLETS.utilities = (function($, viewEngine){
    var viewTemplates = {
        bookMarkletWrapper : "<div style='position: absolute; z-index: 99999999'>" +
            "<div style='position:relative; background-color: white; border: black; width: 200px;' class='bodyContents'>"+
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
        generateBookmarkletInView  : generateBookmarkletInView,
        showBookmarklet : function(bookmarklet){
            $(bookmarklet).show();
        },
        hideBookmarklet : function(bookmarklet){
            $(bookmarklet).hide();
        }
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
            if(!this.bookMarklet || !this.bookMarkletRendered){
                this.bookMarklet = utilities.generateBookmarkletInView(this.$view, viewTemplates.bookMarkletContents);
                this.bookMarkletRendered = true;
                var shoppingListView = $(this.bookMarklet);
                this.shoppingListPage = new shoppingListPageConstr(shoppingListView);
                this.shoppingListPage.init();
            }
            this.shoppingListPage.setUserName(userName);
        }
    };
    return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilities, PERSONALSHOPPER.CONTROLLERS.ShoppingListPage);

PERSONALSHOPPER.BOOKMARKLETS.SaveForLater = (function(utilities, SaveForLaterController){
    var viewTemplates = {
        bookMarkletContents:  '<section/>'
    },
    Constr = function($view){
        this.$view = $view;
        this.saveForLaterController = null;
        this.bookMarklet = null;
        this.bookMarkletRendered = false;
        var self = this;
        eventBroker.bind('saveForLaterDesired', function(product){
            self.openSaveForLater(product);
        });
    };
    Constr.prototype = {
        constructor : PERSONALSHOPPER.BOOKMARKLETS.addToListWindow,
        openSaveForLater : function(product){
            if(!this.bookMarklet || !this.bookMarkletRendered){
                this.bookMarklet = utilities.generateBookmarkletInView(this.$view, viewTemplates.bookMarkletContents);
                this.bookMarkletRendered = true;
                var saveForLaterView = $(this.bookMarklet);
                this.saveForLaterController = new SaveForLaterController(saveForLaterView);
                this.saveForLaterController.init();
            }
            this.saveForLaterController.openSaveForLater(product);
        }
    };
    return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilities, PERSONALSHOPPER.CONTROLLERS.SaveForLater);

PERSONALSHOPPER.BOOKMARKLETS.SaveForLaterPrompter = (function(utilities){
    var viewTemplates = {
        bookMarkletContents:  "<a href='#' alt='Save For Later' class='saveForLater'>Save for Later</a>"
    },
    Constr = function($view){
        this.$view = $view;
        this.shoppingListPage = null;
        this.bookMarklet = null;
        this.bookMarkletRendered = false;
        this.bookMarkletShown = false;
    };
    Constr.prototype = {
        promptToAddToList : function(product){
            if(!this.bookMarklet || !this.bookMarkletRendered){
                this.bookMarklet = utilities.generateBookmarkletInView(this.$view, viewTemplates.bookMarkletContents);
                var self = this;
                this.bookMarkletRendered = true;
                this.bookMarkletShown = true;
            }
            if(!this.bookMarkletShown)
                utilities.showBookmarklet(this.bookMarklet);

            $(this.bookMarklet).find('a.saveForLater').click(function(event){
                event.preventDefault();
                self.saveForLaterClicked(product);
            });
        },
        saveForLaterClicked : function(product){
            utilities.hideBookmarklet(this.bookMarklet);
            eventBroker.fire('saveForLaterDesired', product);
        }
    }
    return Constr;
})(PERSONALSHOPPER.BOOKMARKLETS.utilities);