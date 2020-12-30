import * as React from 'react';
import {Component, Fragment} from 'react';
import {
  Actions,
  Reducer as FluxReducer,
  Router,
  Scene,
  Tabs,
} from 'react-native-router-flux';
import NavBar from './NavBar';
import HomeScene from '../scenes/HomeScene';
import HistoryScene from '../scenes/HistoryScene';
import SettingsScene from '../scenes/SettingsScene';
import {SafeAreaView} from 'react-native';
import Expenses from '../scenes/ExpensesScene';
import LicensesScene from '../scenes/LicensesScene';
import RecuringTransactionsScene from '../scenes/RecurringTransactionsScene';
import PrivacyScene from '../scenes/PrivacyScene';

export default class AppRouter extends Component {
  render() {
    const scenes = Actions.create(
      <Scene key="root">
        <Tabs
          key="navbar"
          tabBarPosition="bottom"
          tabBarComponent={NavBar}
          hideNavBar>
          <Scene key="navbartransitions" hideNavBar>
            <Scene
              key="home"
              component={HomeScene}
              title="Übersicht"
              hideNavBar
              initial
            />
            <Scene
              key="history"
              component={HistoryScene}
              title="Historie"
              hideNavBar
            />
            <Scene
              key="expenses"
              component={Expenses}
              title="Ausgaben"
              hideNavBar
            />
            <Scene
              key="settings"
              component={SettingsScene}
              title="Einstellungen"
              hideNavBar
            />
          </Scene>
        </Tabs>
        <Scene key="licenses" component={LicensesScene} title="Bibliotheken" />
        <Scene
          key="recurring"
          component={RecuringTransactionsScene}
          title="Monatliche Ausgaben"
        />
        <Scene key="privacy" title="Datenschutz" component={PrivacyScene} />
      </Scene>,
    );

    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <Router scenes={scenes} backAndroidHandler={() => Actions.pop()} />
        </SafeAreaView>
      </Fragment>
    );
  }
}
