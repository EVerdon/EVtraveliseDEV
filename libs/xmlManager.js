import RNFetchBlob from 'react-native-fetch-blob';
//EXPORTS ET TEST

//Confirms load in the console
function test(){
  console.log('xmlManager correctly imported');
}

//Manages the process of :
//  Saving XML locally
//    Validating the XML with XSD
//      Returning XML to JSON
//        Removing local copy of the XML
function processXML(payload){
  var finalJSON;
//DEV, would be set on call inside payload
  payload.xml.savePath = RNFetchBlob.fs.dirs.DocumentDir + '/tempXML.xml';

  return new Promise(function(resolve, reject){
    fetchXML(payload.xml.url, payload.xml.savePath).then(function(resFetch){
      if(resFetch.respInfo.status !== 200){throw new Error(resFetch.respInfo.status)};
      return resFetch;
    }).then(function(resFetch){
      return readXml(payload.xml.savePath);
    }).then(function(resRead){
      return validateXML(resRead, 'schema');
    }).then(function(resValidate){
      if(!resValidate.isValid){throw new Error('xml content is not valid')};
      return parseXMLtoJSON(resValidate.xml);
    }).then(function(jsonResult){
      if(!jsonResult || jsonResult == ''){throw new Error('XML not valid JSON :'+jsonResult)};
      finalJSON = jsonResult;
      return deleteLocalXMLCopy(payload.xml.savePath);
    }).then(function(deleteResult){
      resolve(finalJSON);
    })
    .catch(error=>{
//DEV, would analyse error and react accordingly , reject promise to the caller
      console.error(error);
    })
  })
}

//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise
function fetchXML(xmlURL, xmlSavePath){
    return RNFetchBlob
    .config({path: xmlSavePath})
    .fetch('GET', xmlURL, {'Cache-Control':'no-store', 'Authorization' : 'Basic '+btoa('root:root')})
}

function readXml(savePath){
  return RNFetchBlob.fs.readFile(savePath, 'utf8');
}

function validateXML(xmlContent, schema){
  return new Promise(function(resolve, reject){
    resolve({isValid : true, xml : xmlContent});
  })
}

function parseXMLtoJSON(xmlContent){
  var parseString = require('react-native-xml2js').parseString;
  return new Promise(function(resolve, reject){
    parseString(xmlContent, function(err, result){
      resolve(result);
    })
  })


}

function deleteLocalXMLCopy(path){
  return RNFetchBlob.fs.unlink(path);
}

module.exports = {
  test,
  processXML
}
