import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {Text, ToastAndroid, View} from 'react-native';
import {Switch} from 'react-native-gesture-handler';

export interface OtherSettingsSceneProps {}

export interface OtherSettingsSceneState {
  showDefaultKeyboard: boolean;
  showDarkModeStyle: boolean;
}

class OtherSettingsScene extends Component<
  OtherSettingsSceneProps,
  OtherSettingsSceneState
> {
  readonly state: OtherSettingsSceneState = {
    showDefaultKeyboard: false,
    showDarkModeStyle: false,
  };

  componentDidMount() {
    AsyncStorage.getItem('showDarkmodeStyle').then(value => {
      if (value) {
        this.setState({showDarkModeStyle: value === 'true'});
      }
    });
  }

  async setDarkmodeSupport(value: boolean) {
    this.setState({showDarkModeStyle: value});
    AsyncStorage.setItem('showDarkmodeStyle', value.toString())
      .then()
      .catch(() => {
        ToastAndroid.show(
          'Es ist ein Fehler beim Speichern aufgetreten',
          ToastAndroid.SHORT,
        );
        this.setState({showDarkModeStyle: !value});
      });
  }

  render() {
    return (
      <View style={{padding: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: 'black',
            borderRadius: 15,
            borderWidth: 1,
            alignItems: 'center',
            paddingVertical: 10,
            paddingLeft: 10,
            paddingRight: 5,
            marginBottom: 15,
            marginTop: 25,
          }}>
          <Text>Dark-Mode Farben nutzen</Text>
          <Switch
            value={this.state.showDarkModeStyle}
            onValueChange={value => this.setDarkmodeSupport(value)}
          />
        </View>
        <Text style={{marginLeft: 10}}>
          Falls Sie den Dark-Mode Ihres Betriebssystems nutzen und es werden
          Farben nicht richtig angezeigt, können Sie dies hier einstellen
        </Text>
      </View>
    );
  }
}

export default OtherSettingsScene;
