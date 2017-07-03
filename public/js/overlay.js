/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();
var builder = new ActivityBuilder();

t.render(function(){
  Trello.authorize({type: "popup", name: "DM Trello History", persist: true, expiration: "never", interactive: true, success: function (){
    t.card('id')
    .then(function(res) {
      Trello.get('cards/' + res.id + '/actions?filter=all&display=true&entities=true', {}, function(responseObjects){
        document.getElementById('subcontent').textContent = '';

        responseObjects.forEach(function(elem) {
          document.getElementById('subcontent').appendChild(builder.makeItem(elem));
        });

        window.focus(); // Grab focus so that ESC will immediately close the popup rather than the card underneath.
      });
    });
  }, error: function(err) {
    console.log('Fail: ' + err);
  }});

  return true;
});

// close overlay if user clicks outside our content
document.addEventListener('click', function(e) {
  if(e.target.tagName == 'BODY') {
    t.closeOverlay().done();
  }
});

// close overlay if user presses escape key
document.addEventListener('keyup', function(e) {
  if(e.keyCode == 27) {
    t.closeOverlay().done();
  }
});
