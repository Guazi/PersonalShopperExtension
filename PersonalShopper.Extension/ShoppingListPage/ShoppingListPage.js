var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BACKGROUNDPAGES = PERSONALSHOPPER.BACKGROUNDPAGES  || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.BACKGROUNDPAGES.viewTemplates = {
    getUserNameView : "<form class='getUserNameForm'>" +
        "<label for='userName'>Enter User Name</label><input type='text' name='userName' value='{{userName}}' />" +
        "<input type='submit' value='save''/>" +
        "</form>",
    loggedInUserNameView : "Your user name is {{userName}}. <a href=''#' class='setUserLink'>Set username</a>",
    notLoggedInUserNameView : "You don't have a username. <a href=''#' class='setUserLink'>Set username</a>"
};

PERSONALSHOPPER.BACKGROUNDPAGES.ShoppingListController = (function($, viewTemplates, viewEngine, shoppingCartContextService){
    var MODELS = {
        userInformation : function(userName){
            this.userName = userName;
        }
    };
    var Constr = function($view){
        this.$view = $view;
    };
    Constr.prototype = {
        renderUserInformation : function(){
            debug.log(['view is', this.$view]);
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            this.renderUserInformationView(currentUserName);
        },
        renderUserInformationView : function(userName){
            var viewTemplate = userName != null ? viewTemplates.loggedInUserNameView : viewTemplates.notLoggedInUserNameView;
            var model = new MODELS.userInformation(userName);
            var toPopulate = this.$view.find('fieldset.userInformation');
            viewEngine.renderInElement(viewTemplate, model, toPopulate);

            var self = this;
            this.$view.find('a.setUserLink').click(function(event){
                self.promptForUserName.call(self);
                event.preventDefault();
            });
        },
        promptForUserName : function(){
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            var model = new MODELS.userInformation(currentUserName);
            var viewTemplate = viewTemplates.getUserNameView;
            var toPopulate = this.$view.find('fieldset.userInformation');
            viewEngine.renderInElement(viewTemplate, model, toPopulate);
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
            return this.renderUserInformationView(userName);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.BACKGROUNDPAGES.viewTemplates,
   PERSONALSHOPPER.UTILITIES.viewEngine,
   PERSONALSHOPPER.SERVICES.shoppingCartContextService);

