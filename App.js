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
      'xml' : {'url' : 'https://www.w3schools.com/xml/cd_catalog.xml'},
      'travel' : {id:'X', version:1},
      'file' : {id:'Z'}
    }
    processXML(payload).then(function(result){
      console.log(result);
      app.setState({
        displayText: result.CATALOG.CD[5].TITLE
      })
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
