import * as React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem} from 'react-native-elements';

export default class SettingsScene extends Component {
  render() {
    return (
      <KeyboardAvoidingView
        style={{padding: 20, flex: 1, backgroundColor: '#cccccc32'}}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <View style={{width: '100%', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 15,
                fontSize: 20,
                textAlign: 'left',
              }}>
              Einstellungen
            </Text>

            <ListItem
              bottomDivider
              topDivider
              onPress={() => Actions.jump('monthlyAvailable')}>
              <ListItem.Content>
                <ListItem.Title>Monatlich verfügbares Geld</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem bottomDivider onPress={() => Actions.jump('recurring')}>
              <ListItem.Content>
                <ListItem.Title>Monatliche Ausgaben</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem bottomDivider onPress={() => Actions.jump('categories')}>
              <ListItem.Content>
                <ListItem.Title>Eigene Kategorien</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              onPress={() => Actions.jump('otherSettings')}>
              <ListItem.Content>
                <ListItem.Title>Sonstige Einstellungen</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem bottomDivider onPress={() => Actions.jump('licenses')}>
              <ListItem.Content>
                <ListItem.Title>Verwendete Bibliotheken</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem bottomDivider onPress={() => Actions.jump('privacy')}>
              <ListItem.Content>
                <ListItem.Title>Datenschutz</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </View>
        <View style={{flexGrow: 1}}></View>
        <View>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>App-Version 1.2</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
