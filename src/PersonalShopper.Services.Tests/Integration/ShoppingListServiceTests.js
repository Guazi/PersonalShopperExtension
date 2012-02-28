var http = require('http');

console.log('creating request');
var req = http.request({
    host: 'localhost',
    port: 3000,
    path : 'addProductToList',
//    data : {
//        productInfo : {},
//        userName : "stangogh@gmail.com",
//        listTypeId : 5
//    },
    method: 'POST'
}, function(res){
    res.on("data", function(chunk){
       console.log('BODY: ' + chunk);
    });
});

req.end();

console.log('ending request');