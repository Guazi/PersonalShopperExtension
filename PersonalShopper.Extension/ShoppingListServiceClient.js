var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};
PERSONALSHOPPER.REPOSITORIES = PERSONALSHOPPER.REPOSITORIES || {};



PERSONALSHOPPER.SERVICES.shoppingListServiceClient = (function(serviceClient){
    //var serviceHostUrl = 'http://personalshopperservice.apphb.com';
    var serviceHostUrl = 'http://localhost:9090';
    return {
        addProductToList : function(productInfo, userName, listTypeId, callback){
            var postData = {
                productInfo : productInfo,
                userName : userName,
                listTypeId : listTypeId
            };
            serviceClient.asyncPostJson(serviceHostUrl + '/shoppinglist/addtoshoppinglist', 'put', postData, callback);
        },
        getUsersShoppingList : function(userName, callback){
            var getUrl =   serviceHostUrl + '/shoppinglist/GetUsersShoppingList/' + userName;
            serviceClient.asyncGet(getUrl, function(data){
                var shoppingList;
                if(!data || data === 'null')
                    shoppingList = null;
                else {
                    shoppingList = JSON.parse(data);
                }
                callback(shoppingList);
            });
        }
    };
})(PERSONALSHOPPER.UTILITIES.serviceClient);
