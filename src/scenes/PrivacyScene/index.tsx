import * as React from 'react';
import {Component} from 'react';
import {View, Text, Linking, ScrollView} from 'react-native';
import {ColorType, getColor, getTextColor} from '../../styles/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';

type PrivacySceneProps = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

export default class PrivacyScene extends Component<PrivacySceneProps> {
  isDarkMode = this.props.route.params?.isDarkMode;
  render() {
    return (
      <View
        style={{
          backgroundColor: getColor(ColorType.background, this.isDarkMode),
          flex: 1,
          padding: 10,
        }}>
        <ScrollView>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              marginTop: 10,
              marginBottom: 25,
              color: getTextColor(this.isDarkMode),
            }}>
            Deine Daten gehören nur dir!
          </Text>
          <Text
            style={{
              fontSize: 17,
              flex: 1,
              flexWrap: 'wrap',
              color: getTextColor(this.isDarkMode),
            }}>
            {`Wir sammeln keinerlei Daten über dich!\n\nDeshalb werden deine Daten von uns nirgends gespeichert, außer auf deinem Gerät.\nSolltest du App Backup eingeschaltet haben, wird die Datenbank mit deinen Ausgaben in deiner Google Drive gespeichert und bei Installation auf einem neuen Gerät wieder hergestellt.\nNormalerweise ist diese Einstellung unter System -> Backup/Wiederherstellung zu finden. Dort werden bis zu 25 MB gespeichert, die aber nicht in dein Google Drive Speicherlimit zählen.\nFalls du dies nicht möchtest, musst du diese Synchronisation ausschalten.\n\n`}
          </Text>
          <Text
            style={{
              fontSize: 16,
              flex: 1,
              color: getTextColor(this.isDarkMode),
            }}>
            Solltest du dennoch Fragen zum Datenschutz haben, schreib uns gerne
            eine{' '}
            <Text
              style={{textDecorationLine: 'underline', color: 'gray'}}
              onPress={() =>
                Linking.openURL('mailto:doco-app@dennisostertag.de')
              }>
              Email
            </Text>
            .
          </Text>
        </ScrollView>
      </View>
    );
  }
}
