var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};
PERSONALSHOPPER.REPOSITORIES = PERSONALSHOPPER.REPOSITORIES || {};

PERSONALSHOPPER.REPOSITORIES.mongoUtilities = (function(){
    var generateMongo = function(){
        if(process.env.VCAP_SERVICES){
            var env = JSON.parse(process.env.VCAP_SERVICES);
            var mongo = env['mongodb-1.8'][0]['credentials'];
        }
        else{
            var mongo = {
                "hostname":"localhost",
                "port":27017,
                "username":"",
                "password":"",
                "name":"",
                "db":"personalshopper"
            };
        }

        return mongo;
    },
        generateUrlForMongo = function(obj){obj.hostname = (obj.hostname || 'localhost');
            obj.port = (obj.port || 27017);
            obj.db = (obj.db || 'test');

            if(obj.username && obj.password){
                return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
            }
            else{
                return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
            }
        };
    return {
        generateMongoUrl : function(){
            var mongo = generateMongo();
            var mongourl = generateUrlForMongo(mongo);
        }
    }
})();

PERSONALSHOPPER.REPOSITORIES.usersRepository = (function(mongoUtilities, mongoDb){
    var mongoUrl = mongoUtilities.generateMongoUrl();
    return {
        getUserId : function(userName, callback){
            mongoDb.connect(mongoUrl, function(err, conn){
               conn.collection('users', function(err, coll){
                  var user = coll.findOne(userName);
                  if(!user)
                    throw new Error('No user exists with name' + userName);
                   callback(user._id);
               });
            });
        }
    };
})(PERSONALSHOPPER.REPOSITORIES.mongoUtilities, require('mongodb'));

PERSONALSHOPPER.REPOSITORIES.shoppingListRepository = (function(mongoUtilities, mongoDb){
    var mongoUrl = mongoUtilities.generateMongoUrl();
    return {
        addProductToShoppingList : function(productInfo, userId, listCategoryId, callback){
            mongoDb.connect(mongoUrl, function(err, conn){
               conn.collection('shoppingLists', function(err, coll){
                   var shoppingList = coll.findOne()
               });
            });
        }
    };
})(PERSONALSHOPPER.REPOSITORIES.mongoUtilities, require('mongodb'));



PERSONALSHOPPER.SERVICES.shoppingListService = (function(exports){
    var currentSku = 0;
    var addProductToList = function(addProductToListInput, done){
        usersRepository.getUserId(addProductToListInput.userName, function(userId){
           console.log('user id is');
           console.log(userId);
            shoppingListRepository.addProductToShoppingList(
                addProductToListInput.productInfo,
                userId,
                addProductToListInput.listCategoryId,
            function(listEntryId){

            });

        });

        done(addProductToListInput);
    };
    exports.addProductToList = addProductToList;
})(exports, PERSONALSHOPPER.REPOSITORIES.usersRepository, PERSONALSHOPPER.REPOSITORIES.shoppingListRepository);