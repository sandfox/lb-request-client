/**
  An example of a daftly simple custom load balancer.
  It always returns the same target
 */

var lbRequestClient = require('../');

var customLoadBalancer = {
  chooseServer: function(){
    return {hostname:"bing.com", port:80}
  }
}

var myServiceConfig = {
  loadbalancer: customLoadBalancer
}

var myClient = lbRequestClient.createHTTPClient(myServiceConfig)

myClient.request('/', done);

function done(err, response, body){
    if(err){
      console.log(err, err.stack);
    }
    console.log(response.headers);
}
