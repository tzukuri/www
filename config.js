
/**
 * Module dependencies.
 */
var express = require('express'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    liquid = require('shopify-liquid');

module.exports = function() {
  var app = express();

  var engine = liquid({
    root: path.join(__dirname, 'src', 'layouts'),
    extname: '.liquid'
  });

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'src', 'layouts'));
  
  // liquid templates
  app.set('views', [path.join(__dirname, 'src', 'layouts'), path.join(__dirname, 'src', 'components')])
  app.engine('liquid', engine.express());
  app.set('view engine', 'liquid');

  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(errorHandler());

  return app;
}();
