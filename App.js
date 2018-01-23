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
    this.state = {
      displayTxt1:'2nd element of the list'
    }
  }

  _startXMLProcess(){
    var travel = {id:'X', version:1};
    var file = {id:'Z'};
    processXML({travel, file})
    .then((json)=>{
      console.log(json);
      this.setState({
        displayTxt1: json.ROOTNODE.VOYAGE[0].NOM[0]
      })
    })
    .catch((error)=>{
      console.log(error);
    })
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
        <Text> {this.state.displayTxt1}</Text>
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
