/**
 * react native app used to dev. modules for the travelize IOS app
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import xmlManager, { test, processXML } from './libs/xmlManager';


export default class App extends Component<{}> {
  constructor(){
    super();
    test();
    app = this;
    app.state = {
      displayText:'json element will be displayed here'
    }
  }

  _startXMLProcess(){
    let payload = {
      'xml' : {'url' : 'http://localhost:8888/data/voyage1.xml'},
      'travel' : {id:'X', version:1},
      'file' : {id:'Z'}
    }
    processXML(payload).then(function(result){
      app.setState({
        displayText: result.ROOTNODE.VOYAGE[0].NOM[0]
      })
    }).catch(err=>{
      console.log(err);
    });

  }

  render() {
    return (
      <View style={styles.container}>
      <Text> Welcome my friend </Text>
      <Button
        onPress={()=>this._startXMLProcess()}
        title='Start process on XML file'
        color='#841584'
        />
        <Text>{this.state.displayText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
