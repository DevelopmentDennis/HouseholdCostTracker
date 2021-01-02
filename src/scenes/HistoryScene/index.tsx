import moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {globalStyles} from '../../styles/styles';
import {GraphFormat, Transaction} from '../../types/types';

const db = SQLite.openDatabase('CostTracker.db');

interface HistorySceneState {
  elementsToDisplay: Transaction[];
  graphData: GraphFormat[];
  firstEntryDate: Date;
  yearPressed: number;
  monthPressed: string;
  totalSpendForMonth: number;
}

export default class HistoryScene extends Component<
  undefined,
  HistorySceneState
> {
  readonly state: HistorySceneState = {
    elementsToDisplay: [],
    graphData: [],
    firstEntryDate: new Date(),
    yearPressed: moment().year(),
    monthPressed: '',
    totalSpendForMonth: 0,
  };

  componentDidMount() {
    this.getOldestEntry();
  }

  private getOldestEntry() {
    db.transaction((tx) => {
      tx.executeSql(
        `select min(createdAt) as date from Transactions`,
        [],
        (_, resultSet) => {
          try {
            if (resultSet.rows?.item(0).date == null) {
              this.setState({firstEntryDate: new Date()});
            } else {
              this.setState({
                firstEntryDate: new Date(resultSet.rows?.item(0).date),
              });
            }
          } catch (error) {
            console.log('error', error);
          }
        },
        (error) => {
          console.log('error:', error);
          return false;
        },
      );
    });
  }

  private getYearsSinceStartYear(): number[] {
    console.log('startyahr:', moment(this.state.firstEntryDate).year());
    const startYear = moment(this.state.firstEntryDate).year();
    let years: number[] = [];
    for (let i = startYear; i <= moment().year(); i++) {
      years.push(i);
    }
    return years;
  }

  private calculateElementsForMonth() {
    const firstDayOfMonth = moment()
      .year(this.state.yearPressed)
      .month(this.state.monthPressed)
      .startOf('month')
      .toDate();
    const lastDayOfMonth = moment(firstDayOfMonth).add(1, 'M').toDate();

    console.log(firstDayOfMonth);

    db.transaction((tx) => {
      tx.executeSql(
        `select * from Transactions order by date(createdAt) asc`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;
          let data: Transaction[] = [];
          let totalSpend = 0;

          for (let i = 0; i < rows.length; i++) {
            let tra: Transaction = rows.item(i);

            if (
              moment(tra.createdAt).isBetween(firstDayOfMonth, lastDayOfMonth)
            ) {
              totalSpend = totalSpend + tra.amount;
              data.push(tra);
            }
          }

          this.setState({
            elementsToDisplay: data,
            totalSpendForMonth: totalSpend,
          });
        },
        (error) => {
          console.log('error:', error);
        },
      );
    });
  }

  private renderElementsForMonth() {
    return this.state.elementsToDisplay.map((element, index) => (
      <View
        key={index}
        style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
        <Text style={{fontSize: 18}}>
          {moment(element.createdAt).format('dd DD.MM.YYYY').toString()}
        </Text>
        <Text style={{fontSize: 18}}>{element.tag}</Text>
        <Text style={{fontSize: 18}}>{element.amount}€</Text>
      </View>
    ));
  }

  private renderMonths() {
    return moment()
      .localeData()
      .months()
      .map((element, index) => (
        <View key={index}>
          <TouchableOpacity
            style={[globalStyles.rowContainerItem, {marginLeft: 10}]}
            onPress={() => {
              if (this.state.monthPressed === element) {
                this.setState({monthPressed: ''});
              } else {
                this.setState({monthPressed: element}, () =>
                  this.calculateElementsForMonth(),
                );
              }
            }}>
            <Text style={{fontSize: 18}}>{element.toString()}</Text>
            <Text style={{fontSize: 18, color: 'lightgray'}}>
              {' '}
              {this.state.monthPressed === element ? '⌄' : '>'}
            </Text>
          </TouchableOpacity>

          {this.state.monthPressed === element && this.renderTotalSpend()}
          {this.state.monthPressed === element && this.renderElementsForMonth()}
        </View>
      ));
  }

  private renderTotalSpend() {
    console.log('renderTotalSpend');
    if (this.state.totalSpendForMonth === 0) {
      return (
        <View style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
          <Text style={{fontSize: 18, color: 'gray'}}>
            Keine Einträge für diesen Monat
          </Text>
        </View>
      );
    } else {
      console.log('ausgaben:', this.state.totalSpendForMonth);
      return (
        <View style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
          <Text style={{fontSize: 18, color: 'black'}}>Ausgaben Gesamt</Text>
          <Text style={{fontSize: 18}}>
            {this.state.totalSpendForMonth.toFixed(2)}€
          </Text>
        </View>
      );
    }
  }

  private renderYearsAndMonths() {
    return this.getYearsSinceStartYear().map((element, index) => (
      <View key={index}>
        <TouchableOpacity
          key={index}
          style={[globalStyles.rowContainerItem]}
          onPress={() => {
            if (this.state.yearPressed === element) {
              this.setState({yearPressed: -1, monthPressed: ''});
            } else {
              this.setState({yearPressed: element, monthPressed: ''});
            }
          }}>
          <Text style={{fontSize: 18}}>{element.toString()}</Text>
          <Text style={{fontSize: 18, color: 'lightgray'}}>
            {this.state.yearPressed === element ? '⌄' : '>'}
          </Text>
        </TouchableOpacity>
        {this.state.yearPressed === element && this.renderMonths()}
      </View>
    ));
  }

  render() {
    return (
      <ScrollView style={{padding: 10, backgroundColor: '#cccccc32'}}>
        <View style={{marginTop: 15}} />
        {this.renderYearsAndMonths()}
        <View style={{marginTop: 15}} />
      </ScrollView>
    );
  }
}
