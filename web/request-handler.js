var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var  httpHelpers = require('./http-helpers');
// require more modules/folders here!

var requestMethods = {
  "GET" : function(req, res){
    archive.readListOfUrls(function(list) {
      if(list.indexOf(req.url.slice(1)) === -1) {
      // if(archive.isUrlInList(req.url.slice(1), list)) {
        res.writeHead(404, httpHelpers.headers);
        res.end();
      }else{
        var filePath = req.url === '/' ? path.join(archive.paths.siteAssets, "/index.html") : path.join(archive.paths.archivedSites, "www.google.com");
        res.writeHead(200, httpHelpers.headers);
        fs.readFile(filePath, function (err, data) {
          if(err) {
            throw err;
          }
          res.end(data);
        });
      }
    });
  },

  "POST": function(req, res){
    var data = "";

    req.on("data", function(chunk){
      data += chunk;
    });

    req.on("end", function(){
      data = data.slice(4);     //removes "url="
      fs.appendFile(archive.paths.list, data + '\n', function(err, data){
        if(err){
          throw err;
        }
        res.writeHead(302, httpHelpers.headers);
        res.end();
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  requestMethods[req.method](req, res);
};

