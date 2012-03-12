var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.CONTROLLERS = PERSONALSHOPPER.CONTROLLERS  || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.CONTROLLERS.UserInformationController = (function($, viewEngine, shoppingCartContextService){
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
    Constr = function($view, events){
        this.$view = $view.find('fieldset.userInformation');
        this.events = events;
    };
    Constr.prototype = {
        renderUserInformation : function(){
            debug.log(['view is', this.$view]);
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            this.renderUserInformationView(currentUserName);
        },
        renderUserInformationView : function(userName){
            var viewTemplate = userName != null ? viewTemplates.loggedInUserNameView : viewTemplates.notLoggedInUserNameView;
            var model = new models.userInformation(userName);
            viewEngine.renderInElement(viewTemplate, model, this.$view);

            var self = this;
            this.$view.find('a.setUserLink').click(function(event){
                self.promptForUserName.call(self);
                event.preventDefault();
            });
        },
        promptForUserName : function(){
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            var model = new models.userInformation(currentUserName);
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
            shoppingCartContextService.setLoggedInUserName(userName);
            this.events.trigger('userNameSet', userName);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.UTILITIES.viewEngine,
    PERSONALSHOPPER.SERVICES.shoppingCartContextService);

PERSONALSHOPPER.CONTROLLERS.ShoppingListController = (function($, viewEngine, shoppingListService){
    var models = {
    },
    viewTemplates = {
        noShoppingList : "<h2>No shopping list</h2>",
        yourShoppingListOfUser : "<h2>Your shopping list:</h2><table>" +
            "<th><td>Name</td><td>Added On</td></th>" +
            "{{#ShoppingListEntries}}<tr>" +
            "<td>{{ProductName}}</td><td>{{AddedOn}}</td>" +
            "</tr>{{/ShoppingListEntries}}" +
            "</table>"
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
})(jQuery,
    PERSONALSHOPPER.UTILITIES.viewEngine,
    PERSONALSHOPPER.SERVICES.shoppingListServiceClient);

PERSONALSHOPPER.CONTROLLERS.ShoppingListPage = (function($, EventsConstr,
                                                             userInformationControllerConstr,
                                                             shoppingListControllerConstr){
    var Constr = function($view){
        this.$view = $view;
        this.events = new EventsConstr($view);
    };
    Constr.prototype = {
        init : function(){
            this.userInformationController = new userInformationControllerConstr(this.$view, this.events);
            this.shoppingListController = new shoppingListControllerConstr(this.$view, this.events);
            var self = this;
            this.events.bind('userNameSet', function(event, data){
                self.userNameSet(data);
            });
            this.userNameSet(this.userInformationController.getUserName());
            //this.trigger('userNameSet'  );
        },
        userNameSet : function(userName){
            this.userInformationController.renderUserInformation();
            this.shoppingListController.loadShoppingList(userName);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.UTILITIES.Events,
    PERSONALSHOPPER.CONTROLLERS.UserInformationController,
    PERSONALSHOPPER.CONTROLLERS.ShoppingListController
);

