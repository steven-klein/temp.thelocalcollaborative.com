var Metalsmith    = require('metalsmith');
var markdown      = require('metalsmith-markdown');
var layouts       = require('metalsmith-layouts');
var permalinks    = require('metalsmith-permalinks');
var htmlMinifier  = require("metalsmith-html-minifier");
var watch         = require('metalsmith-watch');
var when          = require('metalsmith-if');
var argv          = require('yargs').argv;
var path          = require('path');

Metalsmith(path.resolve(__dirname, '../'))
  .metadata(require('./../src/data'))
  .source('src/templates/pages')
  .destination('docs')
  .clean(false)
  .use(markdown())
  .use(permalinks())
  .use(layouts({
      engine: 'handlebars',
      minifyOptions: {
          collapseWhitespace: true,
          removeComments: true
      },
      helpers: {
        entities : function(str) {
          var map = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#039;'
          };

          return str.replace(/[&<>"']/g, function(m) {
              return map[m];
          });
      }
    },
    directory: 'src/templates/layouts',
    partials: 'src/templates/layouts',
  }))
  .use(when(argv.watch, watch({
      paths: {
        "src/templates/pages/**/*": true,
        "src/templates/layouts/**/*": "src/templates/**/*.md",
        "src/data/**/*": "src/templates/**/*.md",
      },
      invalidateCache: false
    }))
  )
  .use(when(process.env.NODE_ENV === "production", htmlMinifier()))
  .build(function(err, files) {
    if (err) { throw err; }
  });
