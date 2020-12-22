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

export default class AppRouter extends Component {
  render() {
    const scenes = Actions.create(
      <Scene key="root">
        <Scene key="shoppingscenes" hideNavBar>
          <Tabs key="navbar" tabBarPosition="bottom" tabBarComponent={NavBar}>
            <Scene key="shoppingnavbartransitions" hideNavBar>
              <Scene
                key="home"
                component={HomeScene}
                title="Übersicht"
                hideNavBar
                statusBarColor="#000000"
              />
              <Scene
                key="history"
                component={HistoryScene}
                title="Historie"
                hideNavBar
                statusBarColor="#000000"
              />
              <Scene
                key="expenses"
                component={Expenses}
                title="Ausgaben"
                hideNavBar
                statusBarColor="#000000"
              />
              <Scene
                key="settings"
                component={SettingsScene}
                title="Einstellungen"
                hideNavBar
                statusBarColor="#000000"
              />
            </Scene>
          </Tabs>
        </Scene>
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
