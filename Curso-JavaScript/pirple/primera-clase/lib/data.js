/*
* Library for staring or editing data
*/

//Dependencies
let fs = require('fs');
let path= require('path');

// Container for the module (to be exported)
let lib={};

// Base directory of the data folder
lib.baseDir= path.join(__dirname,'/../.data/');

// Write data to a file
lib.create= function(dir,file,data,callback){
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //Convert the data to a string
            let stringData= JSON.stringify(data);
            //Write to a file and close it
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing to the new file');
                        }
                    })
                } else{
                   callback('Error writing to the new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exists');
        }
    });
};

//Read data from a file
lib.read= function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    });
};

//Update a data inside a file
lib.update= function(dir,file,data,callback){
    //Open the file
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
       if(!err && fileDescriptor){
           //Convert the data to string
           let stringData= JSON.stringify(data);

           //Truncate the file
           fs.ftruncate(fileDescriptor,function(err){
               if(!err){
                   //Write the file and close it
                   fs.writeFile(fileDescriptor,stringData,function(err){
                       if(!err){
                           //Close the file
                           fs.close(fileDescriptor,function(err){
                              if(!err){
                                  callback(false);
                              } else{
                                  callback('Error closing the file');
                              }
                           });
                       }else{
                           callback('Error writing the file');
                       }
                   });
               }else{
                   callback('Error truncating file');
               }
           });
       } else{
           callback('Could not open the file for uploading, it may not exist');
       }
    });
};

//Delete a file
lib.delete= function(dir,file,callback){
    //Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else {
            callback('Error deleting file');
        }
    })
};

// Export the module
module.exports= lib;