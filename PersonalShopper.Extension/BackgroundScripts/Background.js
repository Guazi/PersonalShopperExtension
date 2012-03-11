var PERSONALSHOPPER = PERSONALSHOPPER || {};

PERSONALSHOPPER.commands = (function(shoppingCartContextService){

    return {
        getUserName : function(sendResponse){
            var userName = shoppingCartContextService.getLoggedInUserName();
            sendResponse(userName);
        },
        setUserName : function(userName){
           shoppingCartContextService.setLoggedInUserName(userName);
        },
        names : {
            getUserName : 'getUserName',
            setUserName : 'setUserName'
        }
    };
})(PERSONALSHOPPER.SERVICES.shoppingCartContextService);

// event registrations
(function(commands){
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            if(request.command === commands.names.getUserName){
                commands.getUserName(sendResponse);
            } else if(request.command === commands.names.setUserName){
                var userName = request.userName;
                commands.setUserName(userName);
            }
        }
    );
})(PERSONALSHOPPER.commands);