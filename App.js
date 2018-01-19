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
const config={
  'xmlURL':'https://www.w3schools.com/xml/note.xml'
}

export default class App extends Component<{}> {
  constructor(){
    super();
    test();
    app = this;
  }

  _startXMLProcess(){
    processXML(config.xmlURL);
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
