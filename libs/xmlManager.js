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
  console.log('process started on url : '+payload.xml.url);
  let chemin = RNFetchBlob.fs.dirs.DocumentDir + '/tempXML.xml';
  payload.xml.savePath = chemin;
  //let xmlSavePath = RNFetchBlob.fs.dirs.DocumentDir + '/tempXML.xml';
  //let fetchPromise = fetchXML(xmlURL, xmlSavePath);
  fetchXML(payload.xml.url, payload.xml.savePath).then(function(resFetch){
    if(resFetch.code !== 0){throw new Error(resFetch.code)};
    console.log('success');
  })

}

//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise
function fetchXML(xmlURL, xmlSavePath){
  return new Promise(function(resolve, reject){
    RNFetchBlob
    .config({path: xmlSavePath})
    .fetch('GET', xmlURL, {'Cache-Control':'no-store'}
    ).then(function(resFetch){
      if(resFetch.respInfo.status !== 200){
        throw new Error(resFetch.respInfo.status);
      }
      resolve({code: 0, description: 'Download succeeded'});
    }).catch(err => {
      reject({code: 1, description: 'Download failed : ' + err});
    });
});
}

module.exports = {
  test,
  processXML
}
