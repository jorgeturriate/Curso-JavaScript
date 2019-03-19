/*
* Primary file for the API
*
*/

//Dependencies
let http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;
let config= require('./config');
let fs = require('fs');
//let _data= require('./lib/data');
let handlers= require('./lib/handlers');
let helpers= require('./lib/helpers');



//Testing
// @TODO delete this
/*
_data.create('test','newFile', {'foo': 'bar'},function(err){
	console.log("This was the error ",err);
});

_data.read('test','newFile',function(err,data){
	console.log("This was the error ",err,' and this was the data ',data);
});

_data.update('test','newFile',{'fizz':'buzz'},function(err){
	console.log("This was the error ",err);
});

*/

/*
_data.delete('test','newFile',function(err){
	console.log("This was the error ",err);
});
*/

// Instantiate the HTTP Server
let httpServer = http.createServer(function (req, res) {
	unifiedServer(req,res);
});

//Start the HTTP server
httpServer.listen(config.httpPort, function () {
	console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " mode");
});

// Instantiate the HTTPS Server
var httpsServerOptions= {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
};

let httpsServer= http.createServer(httpsServerOptions, function(req,res){
	unifiedServer(req,res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
	console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " mode");
});


// All the server logic for both the http and https server
var unifiedServer= function(req,res){
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
		let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		//Construct the data object to send the object
		let data = {
			'trimmedPath': trimmedPath,
			'payload': helpers.parseJsonToObject(buffer),
			'queryStringObject': queryStringObject,
			'headers': headers,
			'method': method
		};

		//Route the request to the handler specified in the router
		chosenHandler(data, function (statusCode, payload) {
			//Use the statusCode called back by the handler, or default to 200
			statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
			//Use the payload called back by the handler, or default to empty object
			payload = typeof (payload) == 'object' ? payload : {};

			//Convert the payload to a string
			let payloadString = JSON.stringify(payload);

			//Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			//Log the request path
			console.log('Returning this responses: ', statusCode, payloadString);

		});

	});

};

//Define request router
let router={
	'ping' : handlers.ping,
	'users': handlers.users
};