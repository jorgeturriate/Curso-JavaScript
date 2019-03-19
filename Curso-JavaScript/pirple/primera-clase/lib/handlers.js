/*
* Request handlers
*
 */

//Dependencies
let _data= require('./data');
let helpers= require('./helpers');

//Define handlers
let handlers= {};

// Users handler
handlers.users= function(data,callback){
   let acceptableMethods= ['post','get','put','delete'];
   if(acceptableMethods.indexOf(data.method)>-1){
       handlers._users[data.method](data,callback);
   } else{
       callback(405);
   }
};

//Containers for the users submethods
handlers._users={};

// Users-post
// Required data: firstName, lastName, phone, password, tasAgreement
// Optional data: none
handlers._users.post= function(data,callback){
    //Check that all required fields are filled out
    let firstName= typeof(data.payload.firstName)=='string'&& data.payload.firstName.trim().length>0 ? data.payload.firstName.trim() : false;
    let lastName= typeof(data.payload.lastName)=='string'&& data.payload.lastName.trim().length>0 ? data.payload.lastName.trim() : false;
    let phone= typeof(data.payload.phone)=='string'&& data.payload.phone.trim().length == 9 ? data.payload.phone.trim() : false;
    let password= typeof(data.payload.password)=='string'&& data.payload.password.trim().length>0 ? data.payload.password.trim() : false;
    let tasAgreement= typeof(data.payload.tasAgreement)=='boolean'&& data.payload.tasAgreement.trim()== true ? true : false;

    if(firstName && lastName && phone && password && tasAgreement){
        // Make sure that the user doesn't exist
        _data.read('users',phone,function(err,data){
           if(err){
               //Hash the password
               let hashedPassword= helpers.hash(password);

               if(hashedPassword){
                   // Create the user object
                   let userObject= {
                       'firstName': firstName,
                       'lastName': lastName,
                       'phone': phone,
                       'password': hashedPassword,
                       'tasAgreement': tasAgreement
                   };

                   //Store the user
                   _data.create('users',phone,userObject,function(err){
                       if(!err){
                           callback(200);
                       }else{
                           console.log(err);
                           callback(500,{'Error': 'Could not create a new user'});
                       }
                   });
               } else{
                   callback(500,{'Error': 'Could not hash the user\'s password'});
               }

           } else{
               callback(400,{'Error': 'A user with the phone number already exists'});
           }
        });
    } else{
        callback(404, {'Error': 'Missing required fields'});
    }
};

// Users-get
handlers._users.get= function(data,callback){

};

// Users-put
handlers._users.put= function(data,callback){

};

// Users-delete
handlers._users.delete= function(data,callback){

};

// Ping handler
handlers.ping= function(data,callback){
    callback(200);
};

//Not found Handler
handlers.notFound= function(data,callback){
    callback(404);
};

module.exports= handlers;
