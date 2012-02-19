// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

(function(worker){
    worker.addEventListener('message', function(productInfo){
        debug.log(['saving product info:', productInfo]);
    })
})(self);