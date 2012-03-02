var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};
PERSONALSHOPPER.REPOSITORIES = PERSONALSHOPPER.REPOSITORIES || {};



PERSONALSHOPPER.SERVICES.shoppingListServiceClient = (function(serviceClient){
    var serviceHostUrl = /*'http://personalshopper.cloudfoundry.com';*/'http://localhost:50534';
    return {
        addProductToList : function(productInfo, userName, listTypeId, callback){
            var postData = {
                productInfo : productInfo,
                userName : userName,
                listTypeId : listTypeId
            };
            serviceClient.asyncPostJson(serviceHostUrl + '/shoppinglist/addtoshoppinglist', 'put', postData, callback);
        }
    }
})(PERSONALSHOPPER.UTILITIES.serviceClient);
