import * as React from 'react';
import {Component} from 'react';
import {View, Text, Linking} from 'react-native';

export default class PrivacyScene extends Component {
  render() {
    return (
      <View style={{backgroundColor: '#cccccc32', flex: 1, padding: 10}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 10,
            marginBottom: 25,
          }}>
          Ihre Daten gehören nur Ihnen!
        </Text>
        <Text style={{fontSize: 17, flex: 1, flexWrap: 'wrap'}}>
          {`Deshalb werden Ihre Daten ausschließlich auf Ihrem Gerät gespeichert, keine Server und keine Auswertung Ihrer Daten, auch keine anonymen Diagnosedaten.`}
        </Text>
        <Text style={{fontSize: 16, flex: 1}}>
          Sollten Sie dennoch Fragen zum Datenschutz haben, schreiben Sie uns
          gerne eine{' '}
          <Text
            style={{textDecorationLine: 'underline', color: 'gray'}}
            onPress={() => Linking.openURL('mailto:mothy@dennisostertag.de')}>
            Email
          </Text>
          .
        </Text>
      </View>
    );
  }
}
