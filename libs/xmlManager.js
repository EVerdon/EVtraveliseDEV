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

//Manages the process of :
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
  let xmlURL = 'https://www.w3schools.com/xml/note.xml';
return new Promise((resolve, reject)=>{
  //Preparing function calls
  let fetchPromise = fetchXML(xmlURL, xmlSavePath);
//-SAVE XML IN LOCAL FS
  fetchPromise.then((resFetch) =>{
    if(resFetch.code == 0){
//----GET XML FILE CONTENT
      readXml(resFetch.path).then((xmlContent)=>{
//------VALIDATING XML CONTENT WITH XSD
        validateXML(xmlContent, 'xsd')
        .then((resValidate)=>{
          //TODO React to XML validation returned value (true/false)
          if(resValidate.code == 0){
//----------GET JSobject FROM SAVED XML FILE
            parseXMLtoJSON(resValidate.xml)
            .then((resParse) =>{
//------------DELETING LOCAL XML FILE
              deleteLocalXMLCopy(resFetch.path)
              .then((resDel)=>{
                if(resDel){
//----------------OUPUT : JsObject from XML
                  resolve(resParse.jsonval);
                }else{
                  throw new Error("XMl file wasn't properly deleted");
                }
              })
            })
          }else{
            throw new Error('XML not valid');
          }
        })
        .catch((err=>{
          throw new Error('error during validation');
        }))
      })
    }else{
      throw new Error ('Failed to download XML source');
    }
  })
  .catch((err)=>{
//--OUTPUT if an error was thrown
    reject(err);
  })
  })
}
//-------------------------------
//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise of the result code with a description
function fetchXML(xmlURL, savePath){
  return new Promise((resolve, reject) =>{
    let fetchEnded = false;

    const promise = RNFetchBlob.config({
      path: savePath
    }).fetch('GET', xmlURL, {'Cache-Control':'no-store'});

    promise.then(res => {
      fetchEnded = true;
      if(res.respInfo.status !== 200){
        reject({code: 1, description: 'Download failed' + res.respInfo.status});
        return;
      }
      resolve({code: 0, description: 'Download succeeded', path:res.path()});
    }).catch((err) => {
      fetchEnded = true;
      reject({code: 2, description: 'Download failed : ' + err});
    });
});
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

//TODO comment
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
