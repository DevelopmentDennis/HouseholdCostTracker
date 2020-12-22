import moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {GraphFormat, Transaction} from '../../types/types';

const db = SQLite.openDatabase('CostTracker.db');

interface HistorySceneState {
  elementsToDisplay: Transaction[];
  graphData: GraphFormat[];
  firstEntryDate: Date;
  yearPressed: number;
  monthPressed: string;
}

export default class HistoryScene extends Component<
  undefined,
  HistorySceneState
> {
  readonly state: HistorySceneState = {
    elementsToDisplay: [],
    graphData: [],
    firstEntryDate: undefined,
    yearPressed: -1,
    monthPressed: '',
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
            this.setState({
              firstEntryDate: new Date(resultSet.rows?.item(0).date),
            });
          } catch (error) {
            console.log('error', error);
          }

          //this.setState({firstEntryDate:resultSet})
        },
        (error) => {
          console.log('error:', error);
          return false;
        },
      );
    });
  }

  private getYearsSinceStartYear(): number[] {
    const startYear = moment(this.state.firstEntryDate).year();
    let years: number[] = [];
    for (let i = startYear - 2; i <= moment().year(); i++) {
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
        `select * from Transactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;
          let data: Transaction[] = [];

          for (let i = 0; i < rows.length; i++) {
            let tra: Transaction = rows.item(i);

            if (
              moment(tra.createdAt).isBetween(firstDayOfMonth, lastDayOfMonth)
            ) {
              console.log('between:', tra);
              data.push(tra);
            }
          }
          this.setState({elementsToDisplay: data});
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
        style={{
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 10,
          padding: 5,
          marginTop: 10,
          marginLeft: 40,
          backgroundColor: 'lightgray',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{fontSize: 18}}>
          {moment(element.createdAt).format('dd DD.MM.YYYY').toString()}
        </Text>
        <Text style={{fontSize: 18}}>{element.amount}</Text>
        <Text style={{fontSize: 18}}>{element.tag}</Text>
      </View>
    ));
  }

  private renderMonths() {
    return moment()
      .localeData()
      .months()
      .map((element, index) => (
        <View>
          <TouchableOpacity
            key={index}
            style={{
              borderWidth: 2,
              borderColor: 'black',
              borderRadius: 10,
              padding: 5,
              marginTop: 10,
              marginLeft: 20,
              backgroundColor: 'lightgray',
            }}
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
          </TouchableOpacity>
          {this.state.monthPressed === element && this.renderElementsForMonth()}
        </View>
      ));
  }

  private renderYearsAndMonths() {
    return this.getYearsSinceStartYear().map((element, index) => (
      <View>
        <TouchableOpacity
          key={index}
          style={{
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 10,
            padding: 5,
            marginTop: 10,
            backgroundColor: 'lightgray',
          }}
          onPress={() => {
            if (this.state.yearPressed === element) {
              this.setState({yearPressed: -1});
            } else {
              this.setState({yearPressed: element});
            }
          }}>
          <Text style={{fontSize: 18}}>{element.toString()}</Text>
        </TouchableOpacity>
        {this.state.yearPressed === element && this.renderMonths()}
      </View>
    ));
  }

  render() {
    return (
      <ScrollView>
        <Text style={{fontSize: 24, fontWeight: 'bold', alignSelf: 'center'}}>
          Alle Einträge
        </Text>
        {this.renderYearsAndMonths()}
      </ScrollView>
    );
  }
}
