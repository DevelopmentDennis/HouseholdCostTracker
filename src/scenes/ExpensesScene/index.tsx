import * as React from 'react';
import {Component} from 'react';
import {Text} from 'react-native';

export interface ExpensesProps {}

export interface ExpensesState {}

class Expenses extends React.Component<ExpensesProps, ExpensesState> {
  render() {
    return <Text>Ausgaben Einstellungen</Text>;
  }
}

export default Expenses;
