/*
*
* Worker related-tasks
*/

//Dependencies
let path= require('path');
let fs= require('fs');
let _data= require('./data');
let http= require('http');
let https= require('https');
let helpers= require('./helpers');
let url=require('url');

//Instantiate the worker object
let workers={};

//Lookup all the checks ,get their data, send a validator
workers.gatherAllChecks= function(){
    // Get all the checks
    _data.list('checks',function(err,checks){
        if(!err && checks && checks.length>0){
            checks.forEach(function(check){
               _data.read('checks',check,function(err,originalCheckData){
                  if(!err && originalCheckData){
                      workers.validateCheckData(originalCheckData);
                  } else{
                      console.log('Error reading one of the checks data ');
                  }
               });
            });
        } else{
            console.log('Error: Could not find any checks to process');
        }
    });
};

// Sanity-check the check-data
workers.validateCheckData=function(originalCheckData){
    originalCheckData= typeof(originalCheckData)=='object' && originalCheckData!==null ? originalCheckData : {};
    originalCheckData.id= typeof(originalCheckData.id)=="string" && originalCheckData.id.trim().length=="20" ? originalCheckData.id : false;
    originalCheckData.userPhone= typeof(originalCheckData.userPhone)=="string" && originalCheckData.userPhone.trim().length=="9" ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol= typeof(originalCheckData.protocol)=="string" && ['http','https'].indexOf(originalCheckData.protocol.trim())>-1 ? originalCheckData.protocol : false;
    originalCheckData.url= typeof(originalCheckData.url)=="string" && originalCheckData.url.trim().length>0? originalCheckData.url.trim() : false;
    originalCheckData.method= typeof(originalCheckData.method)=="string" && ['get','post','put','delete'].indexOf(originalCheckData.method.trim()) ? originalCheckData.method.trim() : false;
    originalCheckData.successCodes= typeof(originalCheckData.successCodes)=='object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length>0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds= typeof(originalCheckData.timeoutSeconds)=="number" && originalCheckData.timeoutSeconds%1===0 && originalCheckData.timeoutSeconds>=1 && originalCheckData.timeoutSeconds<=5 ? originalCheckData.successCodes : false;

    //Set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state= typeof(originalCheckData.state)=="string" && ['up','down'].indexOf(originalCheckData.state)>-1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked= typeof(originalCheckData.lastChecked)=="number" && originalCheckData.lastChecked%1===0 && originalCheckData.lastChecked>0 ? originalCheckData.lastChecked : false;

    // If all the checks pass, pass the data along the next stop in the process
    if(originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeoutSeconds){
        workers.performCheck(originalCheckData);
    }else{
        console.log('Error: One of the checks is not properly formatted. Skipping it');
    }
};

// Perform the check, send the original check data and the outcome of the check process, to the next step to the process
workers.performCheck= function(originalCheckData){
    // Prepare the initial check outcome
    let checkOutcome= {
      'error': false,
      'responseCode': false
    };

    // Mark that the outcome has not be sent yet
    let outcomeSent= false;

    //Parse the hostname and the path out of the original check data
    let parsedUrl= url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true);
    let hostName= parsedUrl.hostname;
    let path= parsedUrl.path; //Using path and not "pathname" because we want the query string

    // Construct the request
    let requestDetails={
        'protocol': originalCheckData.protocol+':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout': originalCheckData.timeoutSeconds * 1000
    };

    // Instantiate the request object (using either the http or https module)
    let _moduleToUse= originalCheckData.protocol=="http" ? http : https;
    let req= _moduleToUse.request(requestDetails,function(){
        // Grab the status of the sent request

    });

};

// Timer to execute the worker-process once per a minute
workers.loop= function(){
    setInterval(function(){
        workers.gatherAllChecks();
    },1000*60);
};

// Init the script
workers.init=function(){
    //Execute all the checks immediately
    workers.gatherAllChecks();

    //Call the loop so the checks will execute later on
    workers.loop();
};

//Export module
module.exports= workers;
