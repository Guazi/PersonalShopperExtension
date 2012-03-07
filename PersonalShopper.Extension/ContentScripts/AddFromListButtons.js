var PERSONALSHOPPER = PERSONALSHOPPER || {};
PERSONALSHOPPER.ADDFROMLIST = PERSONALSHOPPER.ADDFROMLIST || {};
// global dependency
var debug = debug || PERSONALSHOPPER.UTILITIES.debug;

PERSONALSHOPPER.ADDFROMLIST.buttonTarget = (function () {
    Constr = function (node, matches) {
        var _node = node,
        _matches = matches,
        _addButton = function (node, match) {
            if (node) {
                var newHtml = document.createElement('div'); //.addClass('buyLaterWrapper');
                newHtml.setAttribute('class', 'buyLaterWrapper');
                newHtml.appendChild(document.createTextNode(match));
                var plusButton = document.createElement('a');
                var plusImage = document.createElement('img');
                var imageUrl = chrome.extension.getURL("add.png");
                plusImage.setAttribute('src', imageUrl);
                plusButton.appendChild(plusImage);

                newHtml.appendChild(plusButton);
                if (node.parentNode)
                    node.parentNode.replaceChild(newHtml, node);
            }
        };
        return {
            addBuyLaterButtons: function () {
                if (_node) {
                    for (var i = 0, max = this._matches.length; i < max; i++) {
                        var match = _matches[i];
                    
                        _addButton(this._node, match);
                    }
                }
            }
        };
    },
    return Constr;
} ());


var a = new PERSONALSHOPPER.ADDFROMLIST.buttonTarget();
var b = new PERSONALSHOPPER.ADDFROMLIST.buttonTarget();


a.addBuyLaterButtons();

b.addBuyLaterButtons();

PERSONALSHOPPER.ADDFROMLIST.buttonInjector = (function () {
    var _buttonRegex = /\$(\d{1,3}(\,\d{3})*|(\d+))(\.\d{2})?/g,
        _highlightClass = "highlighted",
        buttonTarget = PERSONALSHOPPER.ADDFROMLIST.buttonTarget, /* dependency */

    _getButtonTargets = function (regex) {
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        var node;
        var textNodes = [];

        while (node = walker.nextNode()) {

            var regexMatches = node.nodeValue.match(regex);
            if (regexMatches && regexMatches.length > 0) {
                var returnedNode = new buttonTarget(node, regexMatches);
                textNodes.push(returnedNode);
            }
        }

        return textNodes;
    }

    return {
        injectButtons: function () {
            var matches;
            var buttonTargets = _getButtonTargets(_buttonRegex);
            for (var i = 0, max = buttonTargets.length; i < max; i++) {
                var buttonTarget = buttonTargets[i];
                buttonTarget.addBuyLaterButtons();
            }
        }
    }
} ());

(function(){
    // startup methods
    PERSONALSHOPPER.ADDFROMLIST.buttonInjector.injectButtons();
} ());


//var regex = /sandwich/;

//// Test the text of the body element against our regular expression.
//if (regex.test(document.body.innerText)) {
//    // The regular expression produced a match, so notify the background page.
//    chrome.extension.sendRequest({}, function (response) { });
//} else {
//    // No match was found.
//}
