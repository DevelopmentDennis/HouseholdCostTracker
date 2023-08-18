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

export type RootStackParamList = {
  NavBar: undefined;
  Licenses: undefined;
  Recurring: undefined;
  MonthlyAvailable: undefined;
  MonthDetails: MonthDetails;
  OtherSettings: undefined;
  Categories: undefined;
  Privacy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default class AppRouter extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="NavBar">
            <Stack.Screen
              options={{headerShown: false}}
              name="NavBar"
              component={NavBar}
            />
            <Stack.Screen name="Licenses" component={LicensesScene} />
            <Stack.Screen
              name="Recurring"
              component={RecuringTransactionsScene}
              options={{title: 'MonatlicheAusgaben'}}
            />
            <Stack.Screen
              name="MonthlyAvailable"
              component={MonthlyAvailableScene}
              options={{title: 'Verfügbarer Betrag'}}
            />
            <Stack.Screen
              name="MonthDetails"
              component={MonthDetailScene}
              options={{title: 'Details'}}
            />
            <Stack.Screen
              name="OtherSettings"
              component={OtherSettingsScene}
              options={{title: 'Sonstige Einstellungen'}}
            />
            <Stack.Screen
              name="Categories"
              component={CategoriesScene}
              options={{title: 'Eigene Kategorien'}}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScene}
              options={{title: 'Datenschutz'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
