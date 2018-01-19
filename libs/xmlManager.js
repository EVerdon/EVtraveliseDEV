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
//      Returning XML to JSON
//        Removing local copy of the XML
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
      console.log(res.path());
      resolve({code: 0, description: 'Download succeeded', path:res.path()});
    }).catch((err) => {
      fetchEnded = true;
      reject({code: 2, description: 'Download failed : ' + err});
    });
});
}

//readXml :  reads XML file and returns xml as string
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

module.exports = {
  test,
  processXML
}
