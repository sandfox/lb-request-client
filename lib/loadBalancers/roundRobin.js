// Very very roughly based on simplification of https://github.com/Netflix/ribbon/wiki/Working-with-load-balancers
var url = require('url');
var roundround = require('roundround');

var roundRobinLoadBalancer = function(listOfServers){


  //Auto parse hostname:port strings into objects
  this._serverList = listOfServers.map(function(srv){
    if(typeof srv === "string"){
      srvParts = srv.split(':')
      return {hostname: srvParts[0], port: srvParts[1]}
    } else {
      //Lol, just hope :-)
      return {hostname:srv.hostname, port: srv.port}
    }
  });
  
  this.chooseServer = roundround(this._serverList);

}

module.exports = roundRobinLoadBalancer;
