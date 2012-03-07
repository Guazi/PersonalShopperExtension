var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.BACKGROUNDPAGES = PERSONALSHOPPER.BACKGROUNDPAGES  || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.BACKGROUNDPAGES.views = {
    getUserNameView : "<label for='userName'>Enter User Name</label><input type='text/javascript' value='{{userName}}' />",
    loggedInUserNameView : "Your user name is {{userName}}",
    notLoggedInUserNameView : "You don't have a username"
};

PERSONALSHOPPER.BACKGROUNDPAGES.shoppingListController = (function(views, viewEngine, shoppingCartContextService){
    var Constr = function(){
    };
    Constr.prototype = {
        renderUserInformation : function(){
            var currentUserName = shoppingCartContextService.getLoggedInUserName();
            var view = currentUserName != null ? views.loggedInUserNameView : views.notLoggedInUserNameView;
            var model = { userName : currentUserName };
            var toPopulate = document.getElementById('userInformation');
            viewEngine.renderInElement(view, model, toPopulate);
        }
    };
    return Constr;
})(PERSONALSHOPPER.BACKGROUNDPAGES.views,
   PERSONALSHOPPER.UTILITIES.viewEngine,
   PERSONALSHOPPER.SERVICES.shoppingCartContextService);

