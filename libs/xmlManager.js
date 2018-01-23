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
function processXML(xmlURL, path){
  console.log('process started on xmlURL : '+xmlURL);
  let xmlSavePath = RNFetchBlob.fs.dirs.DocumentDir + '/tempXML.xml';
  let fetchPromise = fetchXML(xmlURL, xmlSavePath);


  fetchPromise.then(res=>{
    if(res.code == 0){
      console.log('code 0');
    }
  })
  .catch((err)=>{
    console.error(err.code);
    console.error(err.description);
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
      }
      resolve({code: 0, description: 'Download succeeded'});
    }).catch((err) => {
      fetchEnded = true;
      reject({code: 0, description: 'Download failed : ' + err});
    });
});
}

module.exports = {
  test,
  processXML
}
