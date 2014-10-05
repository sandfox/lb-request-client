/**
 Example using default RoundRobin load balancer
 This should launch one requests at google.com and one at yahoo.com
 */

var lbRequestClient = require('../');

var myServiceConfig = {
  servers: ["google.com:80", "yahoo.com:80"]
}

//This config has the same effect as above
var myAlternativeServiceConfig = {
  servers: [
    {hostname: "google.com", port: 80},
    {hostname: "yahoo.com", port: 80}
  ]
}

var target = '/';

var myClient = lbRequestClient.createHTTPClient(myAlternativeServiceConfig)


myClient.request(target, done)
myClient.request(target, done)

function done(err, response, body){
    if(err){
      console.log(err, err.stack);
    }
    console.log(response.headers);
}
