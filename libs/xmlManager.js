import RNFetchBlob from 'react-native-fetch-blob';
//EXPORTS

//Confirms load in the console
function test(){
  console.log('xmlManager correctly imported');
}

//Manages the process of :
//  Saving XML locally
//    Validating the XML with XSD
//      Returning XML to JSON
//        Removing local copy of the XML
function processXML(xmlURL, path){
  console.log('process started on xmlURL : '+xmlURL);
  let xmlSavePath = RNFetchBlob.fs.dirs.DocumentDir + '/tempXML.xml';
  fetchXML(xmlURL, xmlSavePath)
  .then(res=>{
    console.log(res);
  })
  .catch((code, description)=>{
    console.log(code);
    console.log(description);
  })
}

//INTERNAL FUNCTIONS

//Fetch XML from 'xmlURL' to 'path'
//  returns promise
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
        // TODO : tester un throw error à la place
      }
      resolve({code: 2, description: 'Download succeeded'});
    }).catch((errorMessage, statusCode)=>{
      fetchEnded = true;
      reject({code: 3, description: 'Download error ' + statusCode});
    });
});
}

module.exports = {
  test,
  processXML
}
