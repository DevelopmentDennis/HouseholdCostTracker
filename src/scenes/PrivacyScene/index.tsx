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
          Deine Daten gehören nur dir!
        </Text>
        <Text style={{fontSize: 17, flex: 1, flexWrap: 'wrap'}}>
          {`Deshalb werden deine Daten von uns nirgends gespeichert, außer auf deinem Gerät.\nSolltest du App Backup eingeschaltet haben, 
          wird die Datenbank mit deinen Ausgaben in deiner Google Drive gespeichert und bei Installation auf einem neuen Gerät wieder hergestellt.
          Normalerweise ist diese Einstellung unter System -> Backup/Wiederherstellung zu finden.
          Dort werden bis zu 25 MB gespeichert, die aber nicht in dein Google Drive Speicherlimit zählen.\nFalls du dies nicht möchtest, musst du diese Synchronisation ausschalten.`}
        </Text>
        <Text style={{fontSize: 16, flex: 1}}>
          Solltest du dennoch Fragen zum Datenschutz haben, schreib uns
          gerne eine{' '}
          <Text
            style={{textDecorationLine: 'underline', color: 'gray'}}
            onPress={() =>
              Linking.openURL('mailto:doco-app@dennisostertag.de')
            }>
            Email
          </Text>
          .
        </Text>
      </View>
    );
  }
}
