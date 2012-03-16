var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTROLLERS = PERSONALSHOPPER.CONTROLLERS  || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug,
eventBroker = eventBroker || PERSONALSHOPPER.UTILITIES.eventBroker;

PERSONALSHOPPER.CONTROLLERS.UserInformationController = (function($, viewEngine){
    var models = {
        userInformation : function(userName){
            this.userName = userName;
        }
    },
    viewTemplates = {
        getUserNameView : "<form class='getUserNameForm'>" +
            "<label for='userName'>Enter User Name</label><input type='text' name='userName' value='{{userName}}' />" +
            "<input type='submit' value='save''/>" +
            "</form>",
        loggedInUserNameView : "Your user name is {{userName}}. <a href=''#' class='setUserLink'>Set username</a>",
        notLoggedInUserNameView : "You don't have a username. <a href=''#' class='setUserLink'>Set username</a>"
    },
    renderUserInformationView = function($view, userName){
        var viewTemplate = userName != null ? viewTemplates.loggedInUserNameView : viewTemplates.notLoggedInUserNameView;
        var model = new models.userInformation(userName);
        viewEngine.renderInElement(viewTemplate, model, $view);
    },
    Constr = function($view){
        this.$view = $view.find('fieldset.userInformation');
        this.currentUserName = null;
    };
    Constr.prototype = {
        renderUserInformation : function(userName){
            debug.log(['view is', this.$view]);
            renderUserInformationView(this.$view, userName);
            var self = this;
            this.$view.find('a.setUserLink').click(function(event){
                self.promptForUserName.call(self);
                event.preventDefault();
            });
            this.currentUserName = userName;
        },
        promptForUserName : function(){
            var model = new models.userInformation(this.currentUserName);
            var viewTemplate = viewTemplates.getUserNameView;
            viewEngine.renderInElement(viewTemplate, model, this.$view);
            var self = this;
            this.$view.find('form.getUserNameForm').submit(function(event){
                var form = this;
                // todo: $ shortcut not working
                userName = jQuery(form['userName']).val();
                self.setUserName.call(self, userName);
                event.preventDefault();
            });
        },
        setUserName : function(userName){
            eventBroker.fire('userNameSet', userName);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.UTILITIES.viewEngine);

PERSONALSHOPPER.CONTROLLERS.ShoppingListController = (function(viewEngine, shoppingListService){
    var models = {
    },
    viewTemplates = {
        noShoppingList : "<h2>No shopping list</h2>",
        yourShoppingListOfUser : "<h2>Your Shopping List</h2>" +
            "<ul>" +
            "{{#ShoppingListEntries}}<tr>" +
            "<li>{{ProductName}}</li>" +
            "{{/ShoppingListEntries}}" +
            "</ul>"
    },
    renderEmtpyShoppingListView = function($view){
        viewEngine.renderInElement(viewTemplates.noShoppingList, null, $view);
    },
    renderShoppingListView = function(shoppingList, $view){
        var model = shoppingList;
        viewEngine.renderInElement(viewTemplates.yourShoppingListOfUser, model, $view);
    },
    Constr = function($view){
        this.$view = $view.find('section.shoppingList');
    };
    Constr.prototype = {
        loadShoppingList : function(userName){
            var self = this;
            if(userName){
                shoppingListService.getUsersShoppingList(userName, function(data){
                   if(!data)
                       renderEmtpyShoppingListView(self.$view);
                   else
                       renderShoppingListView(data, self.$view);
                });
            }
        }
    };
    return Constr;
})(PERSONALSHOPPER.UTILITIES.viewEngine,
    PERSONALSHOPPER.SERVICES.shoppingListServiceClient);

PERSONALSHOPPER.CONTROLLERS.ShoppingListPage = (function($, eventBroker,
                                                             userInformationControllerConstr,
                                                             shoppingListControllerConstr){
    var Constr = function($view){
        this.$view = $view;
    };
    Constr.prototype = {
        init : function(userName){
            this.userInformationController = new userInformationControllerConstr(this.$view);
            this.shoppingListController = new shoppingListControllerConstr(this.$view);
        },
        setUserName : function(userName){
            var self = this;
            eventBroker.bind('userNameSet', function(userName){
                self.userNameSet(userName);
            });
            eventBroker.fire('userNameSet', userName);
        },
        userNameSet : function(userName){
            this.userInformationController.renderUserInformation(userName);
            this.shoppingListController.loadShoppingList(userName);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.UTILITIES.eventBroker,
    PERSONALSHOPPER.CONTROLLERS.UserInformationController,
    PERSONALSHOPPER.CONTROLLERS.ShoppingListController
);
