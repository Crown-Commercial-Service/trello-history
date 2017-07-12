var compression = require('compression'),
    cors        = require('cors'),
    express     = require('express'),
    swig        = require('swig'),
    app         = express();

app.use(compression());
app.use(cors({ origin: 'https://trello.com' }));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', 'public');

// Add a route for the templated overlay (pulls in Trello API key from environment)
app.get('/overlay.html', function (req, res) {
  res.render('overlay.html', {TRELLO_DEVELOPER_KEY: process.env.TRELLO_DEVELOPER_KEY});
});

// Fall back to serving everything else statically
app.use(express.static('public'));

var listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log('Trello Power-Up Server listening on port ' + listener.address().port);
});
