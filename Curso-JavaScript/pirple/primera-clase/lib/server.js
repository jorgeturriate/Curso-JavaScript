/*
*
* Server related fields
*/

//Dependencies
let http = require('http');
let https= require('https');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config= require('../config');
let fs = require('fs');
//let _data= require('./lib/data');
let handlers= require('./handlers');
let helpers= require('./helpers');
let path= require('path');
let util= require('util');
let debug= util.debuglog('server');

//Instantiate the server module object
let server= {};

// Instantiate the HTTP Server
server.httpServer = http.createServer(function (req, res) {
    server.unifiedServer(req,res);
});

// Instantiate the HTTPS Server
server.httpsServerOptions= {
    'key': fs.readFileSync(path.join(__dirname,'../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'../https/cert.pem'))
};

server.httpsServer= https.createServer(server.httpsServerOptions, function(req,res){
    server.unifiedServer(req,res);
});


// All the server logic for both the http and https server
server.unifiedServer= function(req,res){
    // Get the URL and parse it
    let parseUrl = url.parse(req.url, true);

    //Get the path
    let path = parseUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    let queryStringObject = parseUrl.query;

    //Get the HTTP method
    let method = req.method.toLowerCase();

    //Get the headers as an object
    let headers = req.headers;

    //Get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        //Choose the handler this request should go to, If one is not found use notFound handler
        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory, use the public handler instead
        chosenHandler= trimmedPath.indexOf('public/') >-1 ? handlers.public : chosenHandler;

        //Construct the data object to send the object
        let data = {
            'trimmedPath': trimmedPath,
            'payload': helpers.parseJsonToObject(buffer),
            'queryStringObject': queryStringObject,
            'headers': headers,
            'method': method
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload, contentType) {
            // Determine the type of response (fallback to JSON)
            contentType= typeof (contentType)=='string' ? contentType : 'json';

            //Use the statusCode called back by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //Return the response-parts that are content-specific
            let payloadString='';
            if(contentType=='json'){
                res.setHeader('Content-Type', 'application/json');
                //Use the payload called back by the handler, or default to empty object
                payload = typeof (payload) == 'object' ? payload : {};
                //Convert the payload to a string
                payloadString = JSON.stringify(payload);
            }
            if(contentType=='html'){
                res.setHeader('Content-Type', 'text/html');
                payloadString= typeof(payload)=='string'? payload : '';
            }
            if(contentType=='favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString= typeof(payload)!= undefined ? payload : '';
            }
            if(contentType=='css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString= typeof(payload)!= undefined? payload : '';
            }
            if(contentType=='png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString= typeof(payload)!= undefined? payload : '';
            }
            if(contentType=='jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString= typeof(payload)!= undefined? payload : '';
            }
            if(contentType=='plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString= typeof(payload)!= undefined? payload : '';
            }

            //Return the response-parts that are common to all content-types
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green otherwise print red
            if(statusCode==200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }else{
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode+' '+payloadString);
            }

        });

    });

};

//Define request router
server.router={
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'checks/all': handlers.checkList,
    'checks/create': handlers.checksCreate,
    'checks/edit': handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users': handlers.users,
    'api/tokens':handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico': handlers.favicon,
    'public' : handlers.public
};

// Init script
server.init= function(){

    //Start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m',"The server is listening on port " + config.httpPort + " in " + config.envName + " mode");
    });

    //Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[35m%s\x1b[0m',"The server is listening on port " + config.httpsPort + " in " + config.envName + " mode");
    });
};

//Export the module
module.exports= server;
