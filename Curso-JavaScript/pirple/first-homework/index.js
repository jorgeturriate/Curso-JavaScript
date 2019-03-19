/*
* Author: Jorge
* Api: Hello world api
 */

// Dependencies

let http= require('http');
let url= require('url');
let StringDecoder = require('string_decoder').StringDecoder;

//Create the server

let server= http.createServer(function (req,res) {
    //Parse the url
    let parseUrl= url.parse(req.url, true);

    //Get the path
    let path= parseUrl.pathname;
    let trimmedpath= path.replace(/^\/+|\/+$/g, '');

    // Get headers
    let headers= req.headers;

    // Get queryStringObject
    let queryStringObject= parseUrl.query;

    //Get the HTTP method
    let method= req.method.toLowerCase();

    //Get the payload
    let decoder= new StringDecoder('utf-8');
    let buffer= '';

    req.on('data',function (data) {
        buffer+= decoder.write(data);
    });

    req.on('end',function () {
       buffer+= decoder.end();

       //Choose the handler
       let chosenHandler= typeof(route[trimmedpath]) !== "undefined" ? route[trimmedpath] : handlers.notFound;

       //Data about the request
       let data= {
          'path': path,
          'payload': buffer,
          'method': method,
          'headers': headers
       };

       // Implementation handler
       chosenHandler(data,function (statusCode,payload) {
           //Define statusCode
           statusCode= typeof(statusCode)== "number" ? statusCode : 404;

           //Define the payload
           payload= typeof(payload)=='object' ? payload : {};

           //Convert the payload in string
           let stringPayload= JSON.stringify(payload);

           //Response the user
           res.setHeader('Content-type','application/json');
           res.writeHead(statusCode);
           res.end(stringPayload);

           //Notice the server about the user
           console.log('Request whit status code: '+statusCode+" and payload "+buffer);
       });
    });

});

server.listen(3000,function () {
   console.log('Server listening on the port 3000');
});

//Handlers
let handlers={};

//Hello handler
handlers.hello= function(data,callback){
  callback(401,{'greeting': 'hello hello hello xd'});
};
// Not defined handler
handlers.notFound= function(data,callback){
    callback(404);
};

//Route the request to hello
let route={
    'hello': handlers.hello
};