import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import NavBarItem from './NavBarItem';

export default class NavBar extends Component {
  render() {
    return (
      <View style={styles.navContainer}>
        <NavBarItem
          iconType="font-awesome-5"
          iconName="chart-pie"
          pageName="Übersicht"
          active={Actions.currentScene === 'home'}
          onPress={() => {
            Actions.jump('home');
          }}
        />

        <NavBarItem
          iconType="font-awesome-5"
          iconName="history"
          pageName="History"
          active={Actions.currentScene === 'history'}
          onPress={() => {
            Actions.jump('history');
          }}
        />

        <NavBarItem
          iconType="font-awesome-5"
          iconName="money-bill-alt"
          pageName="Ausgaben"
          active={Actions.currentScene === 'expenses'}
          onPress={() => {
            Actions.jump('expenses');
          }}
        />

        <NavBarItem
          iconType="font-awesome-5"
          iconName="cog"
          pageName="Settings"
          active={Actions.currentScene === 'settings'}
          onPress={() => {
            Actions.jump('settings');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    maxHeight: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    overflow: 'visible',
  },
});
