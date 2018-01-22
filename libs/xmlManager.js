import RNFetchBlob from 'react-native-fetch-blob';
//Code values
// 0 = executed correctly
// >0 = error


//-------------------------------
//EXPORTS

//Confirms load in the console
function test(){
  console.log('xmlManager correctly imported');
}

//Manages the asynchronous process of :
//  Saving XML locally
//    Validating the XML with XSD
//      Get JSON from local XML file
//        Removing local copy of the XML
//Returns a promise with JsObject
function processXML(payload){
  const {travel, file} = payload;

  //TODO Maybe use sanitize and adapt path
  let xmlSavePath = RNFetchBlob.fs.dirs.DocumentDir + '/' + travel.id + '.xml';

  //TODO Temporary xmlURL build with travel object properties to implement
  let xmlURL = 'https://www.w3schools.com/xml/cd_catalog.xml';

  console.log('check1');
  return new Promise((resolve, reject)=>{
    console.log('check2');
    var t = fetchXML(xmlURL, xmlSavePath);
    console.log(t);
    return t;
  }).then(function(resFetch){
    console.log('check3');
    return readXml(resFetch.path);
  }).then(function(xmlContent){
    console.log('check4');
    return validateXML(xmlContent, 'xsd');
  }).then(function(resValidate){
    console.log('check5');
    if(resValidate.code == 0){
      return parseXMLtoJSON(resValidate.xml);
    }
  }).then(function(resParse){
    console.log('check6');
    return deleteLocalXMLCopy(resFetch.path);//error undefined !!
  }).then(function(resDel){
    if(resDel){
      resolve(resParse.jsonval);
    }else{
      throw new Error ('failed');
    }
  }).catch(err=>{
    console.log('Error : '+ err);
  })
  }
//-------------------------------
//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise of the result code with a description
function fetchXML(xmlURL, savePath){
  let fetchEnded = false;
  return RNFetchBlob
  .config({
    path: savePath
  })
  .fetch('GET', xmlURL, {'Cache-Control':'no-store'})
  
  /*return new Promise(function(resolve, reject){
    let fetchEnded = false;
    RNFetchBlob
    .config({
      path: savePath
    })
    .fetch('GET', xmlURL, {'Cache-Control':'no-store'})
    .then(function (res){
      console.log('fetch2');
      fetchEnded = true;
      if(res.respInfo.status !== 200){
        reject({code: 1, description: 'Download failed' + res.respInfo.status});
      }
      console.log('fetch3');
      resolve({code: 0, description: 'Download succeeded', path:res.path()});
    }).catch((err) => {
      fetchEnded = true;
      reject({code: 2, description: 'Download failed : ' + err});
    });
});*/
}

//readXml :  reads XML file from 'path' and returns promise of xml as string
function readXml(savePath){
  return new Promise((resolve, reject)=>{
    RNFetchBlob.fs.readFile(savePath, 'utf8')
   .then((data)=>{
     resolve(data);
   })
   .catch((err)=>{
     reject(err);
   })
  })
}

//Validates XML with schema
//returns 'true' if xml is valid
//returns 'false' if xml is not valid
function validateXML(xmlString, schema){
  //TODO validation du fichier XML avec XSD
  return new Promise((resolve, reject)=>{
    resolve({code: 0, xml: xmlString});
    //reject({code: 1, xml: ''});
  })

}

//Parse XML string 'xmlText' to Javascript object
//Returns the object created
function parseXMLtoJSON(xmlText){
  var parseString = require('react-native-xml2js').parseString;
  let returnVal = {
    code: 1,
    jsonval: null,
    description: 'undefined'};

    return new Promise(function(resolve, reject){
      parseString(xmlText, function(err, result){
        if(result && result !== ''){
          returnVal.code = 0;
          returnVal.description = 'success';
          returnVal.jsonval = result;
          resolve(returnVal);
        }else{
          returnVal.description = "Couldn't parse XML to JSObject";
          reject(returnVal);
        }
      })
    })
}

//Deletes local XML at 'path'
//Returns 'false' if an error was thrown otherwise returns 'true'
//Returns 'true' if no file were deleted but no errors where thrown
function deleteLocalXMLCopy(path){
  return new Promise((resolve, reject)=>{
    RNFetchBlob.fs.unlink(path)
    .then(() => { resolve(true); })
    .catch((err) => { reject(false); })
  })
}

module.exports = {
  test,
  processXML
}
