# lb-request-client

Pretty much a wrapper around mikeal's request for now

Providers a slightly reduced interface where the host:ip is
picked for you via a 'loadbalancer' which you specify at creation time.

The load balancer should probably be configured before supplying it to this object
The load balancer provided only has to supply a "chooseServer" function which returns {hostname: XX, port:YY}

Some general http related bits are from Mafinstosh's etcd client
https://github.com/mafintosh/etcdjs


## Usage

Examples in 'examples/*'


## Why

The idea is that you can create a client for a given service (e.g an internal account service), so that anything else can just use the client without bothering about balancing requests across multiple endpoints, or worrying about service discovery.

```js

// Assume this is a previously constructed instance
var serviceClient;

serviceClient.request('/users/183764', myCallback)
```

The loadbalancer should hide away all the messy bits.

## Todo

- Write tests...
- Allow settings timeouts and request defaults in the client constructor
- Allow information passing back to loadbalancer from the Client

## WARNING

This mostly just proof-of-concept (coming to a production enviroment near you soon).

While I'll try to be semver-ish about this, expect massive changes between major versions.

Any questions, let me know via github issues, twitter, or email
