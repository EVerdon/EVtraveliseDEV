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
//          return JSON
//Returns a promise
function processXML(payload){
  const {travel, file} = payload;

  //TODO Maybe use sanitize and adapt path
  let xmlSavePath = RNFetchBlob.fs.dirs.DocumentDir + '/' + travel.id + '.xml';

  //TODO Temporary xmlURL build with travel object properties to implement
  let xmlURL = 'https://www.w3schools.com/xml/note.xml';

  //Preparing function calls
  let fetchPromise = fetchXML(xmlURL, xmlSavePath);

  fetchPromise.then((res) =>{
    if(res.code == 0){
      //download ok
      readXml(res.path).then((xmlContent)=>{
        validateXML(xmlContent, 'xsd')
        .then((res)=>{
          console.log(res)
          //TODO React to XML validation returned value (true/false)
          if(res.code == 0){
            console.log('XML is valid');
            console.log(res.xml);
            parseXMLtoJSON(res.xml)
            .then((data) =>{
              console.log(data.jsonval);
              console.log(JSON.stringify(data.jsonval));
            })
          }else{
            console.error('XML is not valid')
          }
        })
        .catch((err)=>{

        })
      })
      .catch((err)=>{
        //TODO améliorer gestion des erreurs, Throw ?
        console.error(err);
      })
    }else{
      //download nok
      console.error('download nok')
    }
  })
  .catch((err)=>{
    console.error(err.code);
    console.error(err.description);
  })
}
//-------------------------------
//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise of the result code with a description
function fetchXML(xmlURL, savePath){
  console.log('xmlFetch started to path : '+savePath);
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
      console.log(res.path());
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
  })

}

//TODO comment
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

module.exports = {
  test,
  processXML
}
