import React, {Component} from 'react';
import HomeScene from '../scenes/HomeScene';
import HistoryScene from '../scenes/HistoryScene';
import SettingsScene from '../scenes/SettingsScene';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

const Tab = createBottomTabNavigator();
export default class NavBar extends Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'chart-pie';
                break;
              case 'History':
                iconName = 'history';
                break;
              case 'Settings':
                iconName = 'cog';
                break;
              default:
                iconName = 'question-circle';
                break;
            }
            return (
              <Icon
                type={'font-awesome-5'}
                name={iconName}
                size={focused ? 30 : 25}
                color={color}
              />
            );
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
          },
          tabBarActiveTintColor: 'royalblue',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScene}
          options={{headerShown: false, tabBarLabel: 'Übersicht'}}
          navigationKey={'home'}
        />
        <Tab.Screen
          name="History"
          component={HistoryScene}
          options={{headerShown: false, tabBarLabel: 'Verlauf'}}
          navigationKey={'history'}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScene}
          options={{headerShown: false, tabBarLabel: 'Einstellungen'}}
          navigationKey={'settings'}
        />
      </Tab.Navigator>
    );
  }
}
