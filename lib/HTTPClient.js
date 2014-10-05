/**
  Pretty much a wrapper around mikeal's request for now

  Providers a slightly reduced interface where the host:ip is
  picked for you via a loadbalancer which you specify at creation time.

  The load balancer should probably be configured before supplying it to this object
  The load balancer provided only has to supply a "chooseServer" function which returns {hostname: XX, port:YY}

  Some general http related bits are from Mafinstosh's etcd client
  https://github.com/mafintosh/etcdjs

 */
var url = require('url');
var request = require('request');


var HTTPClient = function(loadbalancer, opts){

  if(!loadbalancer || typeof loadbalancer.chooseServer !== 'function') {
    throw new TypeError("loadbalancer have a method called chooseServer")
  }

  this.loadbalancer = loadbalancer;

  if (!opts) opts = {};

  this.protocol = opts.protocol || "http:"

  // Allow overriding the request module if thats your thing
  this._requester = opts.request || request;

  // for book keeping
  this._requests = [];

};


/**
  opts is basically the same as requests opts,
  except uri should only be a path like '/users/123', otherwise we'll strip off
  everything except pathname from the uri object.
  If you have a query string crap, put that in opts.qs
 */
HTTPClient.prototype.request = function(opts, cb) {

  var self = this;
  var path = "/"; //default to something safe (I hope)

  var canceled = false;

  var server = this.loadbalancer.chooseServer();

  if(typeof opts === "string") {
    path = opts;
    opts = {};
  } else if(typeof opts.uri === "string") {
    path = opts.uri;
  } else if(opts.uri.pathname) {
    // if not string we just assume it's a uri object
    path = opts.uri.pathname;
  }

  // Brute force overwrite uri
  opts.uri = url.format({
        protocol: this.protocol,
        hostname: server.hostname,
        port: server.port,
        pathname: path
      });

  var req = this._requester(opts, function onresponse(err, response, body) {

    //do some record keeping on current requests here
    gc(self._requests, req);

    if (canceled) return;

    if (err) return cb(err);

    cb(null, response, body);
  });

  this._requests.push(req);

  return function destroy() {
    canceled = true;
    req.end();
  };

};

var gc = function(list, item) {
  var i = list.lastIndexOf(item);
  if (i === -1) return;
  if (i === list.length-1) list.pop();
  else if (i === 0) list.shift();
  else list.splice(i, 1);
};

module.exports = HTTPClient;
