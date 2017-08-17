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

toggleDetails = function() {
  $(this).toggleClass('hide');
  $(this).siblings().toggleClass('hide');

  if ($(this).hasClass('js-show-everything')) {
    $('div.mod-other-type').removeClass('hide');
  }
  else
  {
    $('div#subcontent > div').each(function () {
      if (this.dataset.type != 'commentCard') {
        $(this).addClass('hide');
      }
    });
  }
}

toggleChronology = function() {
  $(this).toggleClass('hide');
  $(this).siblings().toggleClass('hide');

  $parent = $('div#subcontent');
  $divs = $parent.children('div')
  if ($(this).hasClass('js-newest-first')) {
    $divs.sort(function (a,b) {return new Date(b.dataset.datetime) - new Date(a.dataset.datetime);});
  }
  else
  {
    $divs.sort(function (a,b) {return new Date(a.dataset.datetime) - new Date(b.dataset.datetime);});
  }
  $divs.detach().appendTo($parent)
}

$('.js-show-everything').click(toggleDetails);
$('.js-show-comments-only').click(toggleDetails);
$('.js-newest-first').click(toggleChronology);
$('.js-oldest-first').click(toggleChronology);
