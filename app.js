
/**
 * Module dependencies.
 */
var prismic = require('prismic-nodejs');
var app = require('./config');
var configuration = require('./prismic-configuration');
var PORT = app.get('port');

// Returns a Promise
function api(req, res) {
  // So we can use this information in the views
  res.locals = {
    endpoint: configuration.apiEndpoint,
    linkResolver: configuration.linkResolver
  };

  res.locals.page_path = req.path;

  return prismic.api(configuration.apiEndpoint, {
    accessToken: configuration.accessToken,
    req: req
  });
}

// Error handling
function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send('404 not found');
  } else {
    res.status(500).send('Error 500: ' + err.message);
  }
}

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

// Route used when integrating the preview functionality
app.route('/preview').get((req, res) => {
  api(req, res).then(api => {
    return prismic.preview(api, configuration.linkResolver, req, res);
  }).catch(err => {
    handleError(err, req, res);
  });
});

function createNav(nav) {
  var menu = nav.getGroup('menu.menuLinks').toArray()
  var links = []

  for (item of menu) {
    links.push({
      title: item.getText('label'),
      url: item.getLink('link').url(configuration.linkResolver)
    })
  }

  return links
}

// Route for pages
app.route('/:uid').get((req, res) => {
  var uid = req.params.uid;

  api(req, res).then(api => {
    api.getByUID('page', uid).then(page => {
      api.getByUID('menu', 'main-nav').then(nav => {
        res.render('page', {
          nav: createNav(nav),
          page: page
        });
      }).catch(err => {
        handleError(err, req, res);
      });
    }).catch(err => {
      handleError(err, req, res);
    });
  });
});

// Route for the homepage
app.route('/').get((req, res) => {
  api(req, res).then(api => {
    api.getByUID('homepage', 'homepage').then(page => {
      api.getByUID('menu', 'main-nav').then(nav => {
        res.render('homepage', {
          nav: createNav(nav),
          page: page
        });
      }).catch(err => {
        handleError(err, req, res);
      });
    }).catch(err => {
      handleError(err, req, res);
    });
  });
});

