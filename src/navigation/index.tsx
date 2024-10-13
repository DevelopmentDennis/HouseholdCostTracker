import * as React from 'react';
import {Component} from 'react';
import LicensesScene from '../scenes/LicensesScene';
import RecuringTransactionsScene from '../scenes/RecurringTransactionsScene';
import PrivacyScene from '../scenes/PrivacyScene';
import CategoriesScene from '../scenes/CategoriesScene';
import MonthDetailScene, {MonthDetails} from '../scenes/MonthDetailScene';
import MonthlyAvailableScene from '../scenes/MonthlyAvailableScene';
import OtherSettingsScene from '../scenes/OtherSettingsScene';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavBar from './NavBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ColorType, DarkMode, getColor, getTextColor} from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORE_DARKMODE} from '../types/types';

export type RootStackParamList = {
  NavBar: DarkMode | undefined;
  Licenses: DarkMode | undefined;
  Recurring: DarkMode | undefined;
  MonthlyAvailable: DarkMode | undefined;
  MonthDetails: MonthDetails;
  OtherSettings: DarkMode | undefined;
  Categories: DarkMode | undefined;
  Privacy: DarkMode | undefined;
};

interface AppRouterProps {}
interface AppRouterState extends DarkMode {}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default class AppRouter extends Component<
  AppRouterProps,
  AppRouterState
> {
  readonly state: AppRouterState = {
    isDarkMode: false,
  };

  componentDidMount() {
    AsyncStorage.getItem(STORE_DARKMODE).then(value => {
      if (value) {
        this.setState({isDarkMode: value === 'true'});
      }
    });
  }

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="NavBar">
            <Stack.Screen
              options={{headerShown: false}}
              name="NavBar"
              component={NavBar}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="Licenses"
              component={LicensesScene}
              options={{
                title: 'Lizenzen',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="Recurring"
              component={RecuringTransactionsScene}
              options={{
                title: 'MonatlicheAusgaben',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="MonthlyAvailable"
              component={MonthlyAvailableScene}
              options={{
                title: 'Verfügbarer Betrag',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="MonthDetails"
              component={MonthDetailScene}
              options={{
                title: 'Details',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="OtherSettings"
              component={OtherSettingsScene}
              options={{
                title: 'Sonstige Einstellungen',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="Categories"
              component={CategoriesScene}
              options={{
                title: 'Eigene Kategorien',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScene}
              options={{
                title: 'Datenschutz',
                headerStyle: {
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.state.isDarkMode,
                  ),
                },
                headerTintColor: getTextColor(this.state.isDarkMode),
                headerTitleStyle: {
                  color: getTextColor(this.state.isDarkMode),
                },
              }}
              initialParams={{isDarkMode: this.state.isDarkMode}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
