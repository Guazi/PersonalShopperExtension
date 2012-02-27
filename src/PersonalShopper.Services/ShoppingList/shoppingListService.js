var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.SERVICES = PERSONALSHOPPER.SERVICES || {};
PERSONALSHOPPER.REPOSITORIES = PERSONALSHOPPER.REPOSITORIES || {};
PERSONALSHOPPER.ENTITIES = PERSONALSHOPPER.ENTITIES || {};

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
               conn.collection('user', function(err, userCollection){
                   userCollection.db.collection('users', function(err, usersCollection){
                       var user = usersCollection.findOne({'profile.userName': userName});
                       if(!user){
                           console.log('No user exists with name ' + userName);
                           callback(null);
                       } else
                           callback(user._id);
                   });
               });
            });
        }
    };
})(PERSONALSHOPPER.REPOSITORIES.mongoUtilities, require('mongodb'));

PERSONALSHOPPER.ENTITIES.ShoppingListProductEntry = function(productInfo, createdOnDate){
    this.productInfo = productInfo,
    this.createdOnDate = createdOnDate
}

PERSONALSHOPPER.REPOSITORIES.shoppingListRepository = (function(mongoUtilities, mongoDb){
    var mongoUrl = mongoUtilities.generateMongoUrl();
    return {
        addProductToShoppingList : function(productInfo, userId, listCategoryId, callback){
            mongoDb.connect(mongoUrl, function(err, conn){
               conn.collection('userShoppingList.userShoppingLists', function(err, coll){
                   coll.update({_id: userId}, {'$push':{'addHistoryList' : productInfo}})
               });
            });
        }
    };
})(PERSONALSHOPPER.REPOSITORIES.mongoUtilities, require('mongodb'));



PERSONALSHOPPER.SERVICES.shoppingListService = (function(exports, usersRepository, shoppingListRepository){
    var currentSku = 0;
    var addProductToList = function(addProductToListInput, done){
        usersRepository.getUserId(addProductToListInput.userName, function(userId){
           console.log('user id is');
           console.log(userId);

            if(userId){
                console.log('adding user');
                var productShoppingListEntry = new
                shoppingListRepository.addProductToShoppingList(
                    addProductToListInput.productInfo,
                    userId,
                    addProductToListInput.listCategoryId,
                function(listEntryId){
                    done(listEntryId);
                });
            }
            else
                done({});
        });

        done(addProductToListInput);
    };
    exports.addProductToList = addProductToList;
})(exports, PERSONALSHOPPER.REPOSITORIES.usersRepository, PERSONALSHOPPER.REPOSITORIES.shoppingListRepository);
