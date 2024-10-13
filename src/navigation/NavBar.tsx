import React, {Component} from 'react';
import HomeScene from '../scenes/HomeScene';
import HistoryScene from '../scenes/HistoryScene';
import SettingsScene from '../scenes/SettingsScene';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {ColorType, DarkMode, getColor} from '../styles/styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '.';

export type RootTabParamList = {
  Home: DarkMode | undefined;
  History: DarkMode | undefined;
  Settings: DarkMode | undefined;
};

export type NavBarProps = NativeStackScreenProps<RootStackParamList, 'NavBar'>;

const Tab = createBottomTabNavigator<RootTabParamList>();
const {height} = Dimensions.get('screen');

export default class NavBar extends Component<NavBarProps> {
  darkMode = this.props.route.params?.isDarkMode;
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
          tabBarStyle: {
            height: height * 0.08,
            minHeight: 55,
            backgroundColor: getColor(
              ColorType.navBar,
              this.props.route.params?.isDarkMode,
            ),
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 12,
            marginBottom: 5,
          },

          tabBarActiveTintColor: getColor(
            ColorType.buttonHighlight,
            this.darkMode,
          ),
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScene}
          options={{headerShown: false, tabBarLabel: 'Übersicht'}}
          navigationKey={'home'}
          initialParams={{isDarkMode: this.darkMode}}
        />
        <Tab.Screen
          name="History"
          component={HistoryScene}
          options={{headerShown: false, tabBarLabel: 'Verlauf'}}
          navigationKey={'history'}
          initialParams={{isDarkMode: this.darkMode}}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScene}
          options={{headerShown: false, tabBarLabel: 'Einstellungen'}}
          navigationKey={'settings'}
          initialParams={{isDarkMode: this.darkMode}}
        />
      </Tab.Navigator>
    );
  }
}
