import * as React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Text} from 'react-native';
import {ListItem} from 'react-native-elements';

interface SettingsSceneProps {
  navigation: any;
}

export default class SettingsScene extends Component<SettingsSceneProps> {
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
              onPress={() =>
                this.props.navigation.navigate('MonthlyAvailable')
              }>
              <ListItem.Content>
                <ListItem.Title>Monatlich verfügbares Geld</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem
              bottomDivider
              onPress={() => this.props.navigation.navigate('Recurring')}>
              <ListItem.Content>
                <ListItem.Title>Monatliche Ausgaben</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              onPress={() => this.props.navigation.navigate('Categories')}>
              <ListItem.Content>
                <ListItem.Title>Eigene Kategorien</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              onPress={() => this.props.navigation.navigate('OtherSettings')}>
              <ListItem.Content>
                <ListItem.Title>Sonstige Einstellungen</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              onPress={() => this.props.navigation.navigate('Licenses')}>
              <ListItem.Content>
                <ListItem.Title>Verwendete Bibliotheken</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              onPress={() => this.props.navigation.navigate('Privacy')}>
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
              <ListItem.Title>App-Version 1.6</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
