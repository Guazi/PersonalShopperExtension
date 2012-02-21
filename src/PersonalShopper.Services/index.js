var shoppingListService = require('./ShoppingList/shoppingListService.js');
var express = require('express');
var app = express.createServer();
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');
app.configure( function(){
    //app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions : true, showStack : true})
    );
    app.use(express.bodyParser());
    app.post('/addProductToList', function(req, res, next){
        console.log('body is:');
        console.log(req.body);
        shoppingListService.addProductToList(req.body, function(productInsertionResult){
            res.send(productInsertionResult);
        });
    });
    app.get('/', function(req, res){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    });
});
app.listen(port, host);
console.log('listening');