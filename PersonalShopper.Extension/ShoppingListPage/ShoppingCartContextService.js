var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};

PERSONALSHOPPER.SERVICES.shoppingCartContextService = (function(userStorage){
    var userNameKey = 'userName';
    return{
        getLoggedInUserName : function(){
            return userStorage.getItem(userNameKey);
        },
        setLoggedInUserName : function(userName){
            userStorage.setItem(userNameKey, userName);
        }
    }
})(PERSONALSHOPPER.UTILITIES.userStorage);