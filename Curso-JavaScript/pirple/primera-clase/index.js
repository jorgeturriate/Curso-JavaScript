/*
* Primary file for the API
*
*/

// Dependencies
let server= require('./lib/server');
let workers= require('./lib/workers');

// Declare the app
let app= {};

// Init the function
app.init= function(){
	// Start the server
	server.init();

	// Start the workers
	workers.init();
};

// Execute
app.init();

//Export
module.exports=app;
