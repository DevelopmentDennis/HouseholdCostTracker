import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {Text, ToastAndroid, View} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {STORE_DARKMODE, STORE_HIDE_RECURRING} from '../../types/types';

export interface OtherSettingsSceneProps {}

export interface OtherSettingsSceneState {
  showDarkModeStyle: boolean;
  hideRecurringExpensesOnHomeScreen: boolean;
}

class OtherSettingsScene extends Component<
  OtherSettingsSceneProps,
  OtherSettingsSceneState
> {
  readonly state: OtherSettingsSceneState = {
    showDarkModeStyle: false,
    hideRecurringExpensesOnHomeScreen: false,
  };

  componentDidMount() {
    AsyncStorage.getItem(STORE_DARKMODE).then(value => {
      if (value) {
        this.setState({showDarkModeStyle: value === 'true'});
      }
    });
    AsyncStorage.getItem(STORE_HIDE_RECURRING).then(value => {
      if (value) {
        this.setState({hideRecurringExpensesOnHomeScreen: value === 'true'});
      }
    });
  }

  async setDarkmodeSupport(value: boolean) {
    this.setState({showDarkModeStyle: value});
    AsyncStorage.setItem(STORE_DARKMODE, value.toString())
      .then()
      .catch(() => {
        ToastAndroid.show(
          'Es ist ein Fehler beim Speichern aufgetreten',
          ToastAndroid.SHORT,
        );
        this.setState({showDarkModeStyle: !value});
      });
  }

  async setRecurringOnHomeScreen(value: boolean) {
    this.setState({hideRecurringExpensesOnHomeScreen: value});
    AsyncStorage.setItem(STORE_HIDE_RECURRING, value.toString())
      .then()
      .catch(() => {
        ToastAndroid.show(
          'Es ist ein Fehler beim Speichern aufgetreten',
          ToastAndroid.SHORT,
        );
        this.setState({hideRecurringExpensesOnHomeScreen: !value});
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
          <Text>Monatliche Ausgaben auf Startseite zeigen</Text>
          <Switch
            value={this.state.hideRecurringExpensesOnHomeScreen}
            onValueChange={value => this.setRecurringOnHomeScreen(value)}
          />
        </View>
        <Text style={{marginLeft: 10}}>
          Da dies meist der größte Anteil der Ausgaben darstellt, gibt es die
          Möglichkeit diese für eine bessere Übersicht auf der Startseite nicht
          anzuzeigen.
        </Text>
      </View>
    );
  }
}

export default OtherSettingsScene;
