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
