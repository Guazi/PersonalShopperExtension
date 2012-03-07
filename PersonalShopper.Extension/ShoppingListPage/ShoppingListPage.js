var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BACKGROUNDPAGES = PERSONALSHOPPER.BACKGROUNDPAGES  || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.BACKGROUNDPAGES.viewTemplates = {
    getUserNameView : "<label for='userName'>Enter User Name</label><input type='text/javascript' value='{{userName}}' />",
    loggedInUserNameView : "Your user name is {{userName}}",
    notLoggedInUserNameView : "You don't have a username. <a href=''#' class='setUserLink'>Set username</a>"
};

PERSONALSHOPPER.BACKGROUNDPAGES.shoppingListController = (function($, viewTemplates, viewEngine, shoppingCartContextService){
    var MODELS = {
        userInformation : function(userName){
            this.userName = userName
        }
    };
    var Constr = function($view){
        this.$view = $view;
    };
    Constr.prototype = {
        renderUserInformation : function(){
            debug.log(['view is', this.$view]);
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            var viewTemplate = currentUserName != null ? viewTemplates.loggedInUserNameView : viewTemplates.notLoggedInUserNameView;
            debug.log(['template is', viewTemplate]);
            var model = new MODELS.userInformation(currentUserName);
            var toPopulate = this.$view.find('fieldset.userInformation');
            debug.log(['to populate', toPopulate]);
            viewEngine.renderInElement(viewTemplate, model, toPopulate);

            var self = this;
            this.$view.find('a.setUserLink').click(function(){
                self.promptForUserName.call(self);
            });
        },
        promptForUserName : function(){
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            var model = new MODELS.userInformation(currentUserName);
            var viewTemplate = viewTemplates.getUserNameView;
            var toPopulate = this.$view.find('fieldset.userInformation');

            viewEngine.renderInElement(viewTemplate, model, toPopulate);
        }
    };
    return Constr;
})(jQuery,
    PERSONALSHOPPER.BACKGROUNDPAGES.viewTemplates,
   PERSONALSHOPPER.UTILITIES.viewEngine,
   PERSONALSHOPPER.SERVICES.shoppingCartContextService);

