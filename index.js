/**
  roughly based on some casual reading of descriptions netflix ribbon
  this impl is very tied to HTTP
 */

var HTTPClient = require('./lib/HTTPClient');
var RoundRobinLoadBalancer = require('./lib/loadBalancers/roundRobin');

/**
  config
    - servers (optional): array of server IP/Host:[PORT] strings that are given to 
      the default loadbalancer
    - loadbalancer (optional): overrides `servers`, a suitable loadbalancer
 */
exports.createHTTPClient = function(config){

  var lb;

  if (!config) config = {}

  if(!config.loadbalancer) {
    lb = new RoundRobinLoadBalancer(config.servers);
  } else if(config.loadbalancer) {
    lb = config.loadbalancer;
  }

  var client = new HTTPClient(lb)

  return client;

}

exports.HTTPClient = HTTPClient;

exports.loadBalancers = {
  RoundRobin: RoundRobinLoadBalancer
}
