/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var GRAY_ICON = './res/grey-history-inspector.png';

var cardButtonCallback = function(t){
  return t.overlay({
    url: './overlay.html',
    args: {}
  });
};

TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Full(er) History',
      callback: cardButtonCallback
    }];
  }
});

console.log('Loaded by: ' + document.referrer);
