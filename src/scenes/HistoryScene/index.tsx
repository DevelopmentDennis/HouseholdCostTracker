import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import FilterDialog from '../../components/FilterDialog';
import TransactionDialog from '../../components/TransactionDialog';
import {globalStyles} from '../../styles/styles';
import {
  GraphFormat,
  STORE_SORTING_DIRECTION,
  Transaction,
} from '../../types/types';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '../../navigation';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootTabParamList} from '../../navigation/NavBar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DatabaseName} from '../../database';

const dbParams: SQLite.DatabaseParams = {name: DatabaseName};

const db = SQLite.openDatabase(
  dbParams,
  () => null,
  () => null,
);

interface HistorySceneState {
  elementsToDisplay: Transaction[];
  graphData: GraphFormat[];
  firstEntryDate: Date;
  yearPressed: number;
  monthPressed: string;
  totalSpendForMonth: number;
  isEditDialogVisible: boolean;
  isFilterDialogVisible: boolean;
  entryPressed?: Transaction;
}

export type HistorySceneProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default class HistoryScene extends Component<
  HistorySceneProps,
  HistorySceneState
> {
  readonly state: HistorySceneState = {
    elementsToDisplay: [],
    isEditDialogVisible: false,
    graphData: [],
    firstEntryDate: new Date(),
    yearPressed: moment().year(),
    monthPressed: '',
    totalSpendForMonth: 0,
    entryPressed: undefined,
    isFilterDialogVisible: false,
  };

  componentDidMount() {
    this.getOldestEntry();
    this.setState({monthPressed: moment().format('MMMM')}, () =>
      this.calculateElementsForMonth(),
    );
  }

  private getOldestEntry() {
    db.transaction(tx => {
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
        error => {
          console.log('error:', error);
          return false;
        },
      );
    });
  }

  private getYearsSinceStartYear(): number[] {
    const startYear = moment(this.state.firstEntryDate).year();
    let years: number[] = [];
    for (let i = startYear; i <= moment().year(); i++) {
      years.push(i);
    }
    return years;
  }

  private async calculateElementsForMonth() {
    const firstDayOfMonth = moment()
      .year(this.state.yearPressed)
      .month(this.state.monthPressed)
      .startOf('month')
      .toDate();
    const lastDayOfMonth = moment(firstDayOfMonth).add(1, 'M').toDate();
    let sortingDirection = '';

    sortingDirection =
      (await AsyncStorage.getItem(STORE_SORTING_DIRECTION)) ?? 'desc';

    db.transaction(tx => {
      tx.executeSql(
        `select * from Transactions order by date(createdAt) ${sortingDirection}`,
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
        error => {
          console.log('error:', error);
        },
      );
    });
  }

  private deleteEntry(id?: number) {
    if (id == null) {
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        `delete from Transactions where id=?`,
        [id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            ToastAndroid.show('Eintrag gelöscht', ToastAndroid.SHORT);
            this.calculateElementsForMonth();
          } else {
            console.log('id not found');
          }
        },
        error => {
          console.log('error:', error);
        },
      );
    });
  }

  private updateEntry(amount: number, category: string, date: Date) {
    if (!this.state.entryPressed || !this.state.entryPressed.id) {
      ToastAndroid.show(
        'Eintrag kann nicht bearbeitet werden',
        ToastAndroid.SHORT,
      );
    }
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Transactions set amount=?, tag=?, createdAt=? where id=?',
        [amount, category, moment(date).format(), this.state.entryPressed!.id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            ToastAndroid.show('Eintrag aktualisiert', ToastAndroid.SHORT);
            this.calculateElementsForMonth();
          } else Alert.alert('Updation Failed');
        },
        error => {
          ToastAndroid.show(
            'Es ist ein Fehler aufgetreten',
            ToastAndroid.SHORT,
          );
        },
      );
    });
  }

  private renderElementsForMonth() {
    return this.state.elementsToDisplay.map((element, index) => (
      <TouchableOpacity
        key={index}
        onPress={() =>
          this.setState({isEditDialogVisible: true, entryPressed: element})
        }>
        <View style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
          <Text style={{fontSize: 18}}>
            {moment(element.createdAt).format('dd DD.MM').toString()}
          </Text>
          <Text style={{fontSize: 18}}>{element.tag}</Text>
          <Text style={{fontSize: 18}}>{element.amount}€</Text>
        </View>
      </TouchableOpacity>
    ));
  }

  private renderDetailButton() {
    if (this.state.totalSpendForMonth !== 0) {
      return (
        <View style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() =>
              this.props.navigation.navigate('MonthDetails', {
                month: this.state.monthPressed,
                year: this.state.yearPressed,
                elementsToDisplay: this.state.elementsToDisplay,
                totalSpend: this.state.totalSpendForMonth.toFixed(2),
              })
            }>
            <Icon name="info-circle" type="font-awesome" color="gray" />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 10,
                color: 'gray',
                textDecorationLine: 'underline',
              }}>
              Details anzeigen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({isFilterDialogVisible: true})}>
            <Icon name="filter" type="font-awesome" color="gray" />
          </TouchableOpacity>
        </View>
      );
    }
  }

  private isCurrentMonthOrFocus(month: string): boolean {
    if (this.state.monthPressed) {
      return this.state.monthPressed === month;
    }
    return (
      moment().format('MMMM') === month &&
      moment().year() === this.state.yearPressed
    );
  }

  private renderMonths() {
    return moment()
      .localeData()
      .months()
      .map((element, index) => (
        <View key={index}>
          <TouchableOpacity
            style={[
              globalStyles.rowContainerItem,
              {
                borderColor: this.isCurrentMonthOrFocus(element)
                  ? 'green'
                  : 'gray',
                borderWidth: this.isCurrentMonthOrFocus(element) ? 2 : 1,
                marginLeft: 10,
              },
            ]}
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
              {this.state.monthPressed === element ? '⌄' : '>'}
            </Text>
          </TouchableOpacity>

          {this.state.monthPressed === element && this.renderDetailButton()}
          {this.state.monthPressed === element && this.renderTotalSpend()}
          {this.state.monthPressed === element && this.renderElementsForMonth()}
        </View>
      ));
  }

  private renderTotalSpend() {
    if (this.state.totalSpendForMonth === 0) {
      return (
        <View style={[globalStyles.rowContainerItem, {marginLeft: 20}]}>
          <Text style={{fontSize: 18, color: 'gray'}}>
            Keine Einträge für diesen Monat
          </Text>
        </View>
      );
    } else {
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
  private hideFilterDialog(hasChanged: boolean = false) {
    this.setState({isFilterDialogVisible: false});
    if (hasChanged) {
      this.calculateElementsForMonth();
    }
  }

  render() {
    return (
      <ScrollView style={{padding: 10, backgroundColor: '#cccccc32'}}>
        <TransactionDialog
          onDelete={this.deleteEntry.bind(this)}
          transactionDialogType="Edit"
          isVisible={this.state.isEditDialogVisible}
          onCloseRequested={() => this.setState({isEditDialogVisible: false})}
          onFinish={this.updateEntry.bind(this)}
          dataToDisplay={this.state.entryPressed}
          submitButtonText={'Ändern'}
        />
        <FilterDialog
          isVisible={this.state.isFilterDialogVisible}
          onClose={() => this.hideFilterDialog()}
          onOrderByAsc={async () => {
            AsyncStorage.setItem(STORE_SORTING_DIRECTION, 'asc').finally(() =>
              this.hideFilterDialog(true),
            );
          }}
          onOrderByDesc={async () => {
            AsyncStorage.setItem(STORE_SORTING_DIRECTION, 'desc').finally(() =>
              this.hideFilterDialog(true),
            );
          }}
        />

        <View style={{marginTop: 15}} />
        {this.renderYearsAndMonths()}
        <View style={{marginTop: 15}} />
      </ScrollView>
    );
  }
}
