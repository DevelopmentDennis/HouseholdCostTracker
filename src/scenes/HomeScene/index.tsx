import {Picker} from '@react-native-community/picker';
import moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Keyboard,
} from 'react-native';
import {Icon, Input, Overlay, Button} from 'react-native-elements';
import {VictoryLegend, VictoryPie} from 'victory-native';
import DateTimeInput from '../../components/DateTimeInput';
import SQLite from 'react-native-sqlite-storage';
import {styles} from './styles';
import {tags} from '../../../assets/defaultTags.json';
import 'moment/locale/de';
import {
  GraphFormat,
  LegendFormat,
  RecurringTransaction,
  Transaction,
} from '../../types/types';
import AsyncStorage from '@react-native-community/async-storage';

const db = SQLite.openDatabase('CostTracker.db');

interface HomeScreenState {
  showLabels: boolean;
  isModalVisible: boolean;
  defaultGraphicData: any;
  dialogAmount: string;
  dialogDateTime: Date;
  dialogCategory: string;
  elementsToDisplay: Transaction[];
  amountAvailable: number;
  isRefreshing: boolean;
  categories: string[];
}

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default class HomeScene extends Component<null, HomeScreenState> {
  readonly state: HomeScreenState = {
    defaultGraphicData: [{y: 0}, {y: 0}, {y: 100}],
    showLabels: false,
    isModalVisible: false,
    dialogAmount: '',
    dialogDateTime: new Date(),
    dialogCategory: '',
    elementsToDisplay: [],
    amountAvailable: 0,
    isRefreshing: false,
    categories: tags,
  };

  private getAllAsyncStorageData() {
    let showLabels: boolean = false;
    let amountAvailable: number = 0;
    AsyncStorage.getItem('showAmountLabels')
      .then((value) => {
        showLabels = value === 'true';
      })
      .catch();

    AsyncStorage.getItem('monthlyAvailableAmount')
      .then((value) => {
        if (value !== null) {
          const amount = Number.parseInt(value);
          if (!isNaN(amount)) {
            amountAvailable = amount;
          }
        }
      })
      .catch();

    AsyncStorage.getItem('customCategories')
      .then((value) => {
        if (value !== null) {
          const customCategories = [...new Set<string>(JSON.parse(value))];
          console.log('cust cat:', customCategories);
          this.setState({
            categories: [...new Set<string>(tags), ...customCategories],
            showLabels,
            amountAvailable,
          });
        }
      })
      .catch((e) => {
        return;
      });
  }

  async componentDidMount() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'create table if not exists Transactions (id integer primary key not null, amount float, createdAt date, tag text);',
        );
        tx.executeSql(
          'create table if not exists RecurringTransactions (id integer primary key not null, amount float, description text);',
        );
      });
    } catch (error) {
      console.log('create failed', error);
    }
    this.getAllAsyncStorageData();
    setTimeout(() => this.renderCurrentTransactions(), 800);
  }

  private renderCurrentTransactions() {
    db.transaction((tx) => {
      let transactions: Transaction[] = [];
      tx.executeSql(
        `select * from Transactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;

          for (let i = 0; i < rows.length; i++) {
            let tra: Transaction = rows.item(i);
            if (moment(tra.createdAt) > moment().startOf('month')) {
              transactions.push({
                ...rows.item(i),
              });
            }
          }

          console.log('tr:', transactions);
        },
        (error) => {
          console.log('error:', error);
          return;
        },
      );

      tx.executeSql(
        `select * from RecurringTransactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;
          let recurringtransactions: Transaction[] = [];

          for (let i = 0; i < rows.length; i++) {
            let tra: RecurringTransaction = rows.item(i);

            recurringtransactions.push({
              amount: Math.round(tra.amount),
              createdAt: new Date(),
              tag: 'Monatlich',
            });
          }

          console.log('rec', recurringtransactions);
          this.setState({
            elementsToDisplay: transactions.concat(recurringtransactions),
          });
        },
        (error) => {
          console.log('error:', error);
          return false;
        },
      );
    });
  }

  validateAmountInput(): number {
    const amount = parseFloat(this.state.dialogAmount.replace(',', '.'));

    if (amount == null || isNaN(amount)) {
      console.log(amount);
      return 0;
    }
    return amount;
  }

  public dropTable() {
    db.transaction(
      (tx) => {
        tx.executeSql('drop table Transactions');
      },
      (error) => console.log('error adding transaction'),
      () => console.log('successfully dropped table Transactions'),
    );
    return true;
  }

  addExpense() {
    const amount = this.validateAmountInput();
    const tag = this.state.dialogCategory ? this.state.dialogCategory : tags[0];

    console.log(
      'datetime:',
      moment(this.state.dialogDateTime).format('YYYY-MM-DD'),
    );
    if (amount === 0) {
      this.setState({isModalVisible: false});
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO Transactions (amount, createdAt, tag) VALUES (?, ? , ?) ',
          [amount, moment(this.state.dialogDateTime).format('YYYY-MM-DD'), tag],
        );
      },
      (error) => console.log('error adding transaction', error),
      () =>
        this.setState({
          isModalVisible: false,
          dialogAmount: '',
          dialogDateTime: new Date(),
          dialogCategory: '',
        }),
    );

    this.renderCurrentTransactions();
  }

  getLegendData(): LegendFormat[] {
    let stringDat: LegendFormat[] = [];
    if (this.state.amountAvailable > 0) {
      if (this.state.showLabels) {
        stringDat.push({name: `Verfügbar ${this.state.amountAvailable}€`});
      } else {
        stringDat.push({name: 'Verfügbar'});
      }
    }
    this.state.elementsToDisplay.forEach((el) => {
      if (!stringDat.find((e) => e.name == el.tag)) {
        if (this.state.showLabels) {
          stringDat.push({name: `${el.tag} ${el.amount}€`});
        } else {
          stringDat.push({name: el.tag});
        }
      }
    });

    return stringDat;
  }

  getGraphData(): GraphFormat[] {
    let graphDat: GraphFormat[] = [];

    if (this.state.amountAvailable > 0) {
      graphDat.push({x: 'Verfügbar', y: 0});
    }
    this.state.elementsToDisplay.forEach((el) => {
      if (graphDat.find((e) => e.x == el.tag)) {
        const index = graphDat.findIndex((ind) => ind.x == el.tag);
        const data = graphDat.find((da) => da.x == el.tag);

        graphDat[index].y = Math.round(data.y + el.amount);
      } else {
        graphDat.push({x: el.tag, y: el.amount});
      }
    });
    console.log('data:', graphDat);

    if (this.state.amountAvailable > 0) {
      let totalSpend: number = 0;
      graphDat.forEach((el) => (totalSpend += el.y));
      graphDat[0].y = Math.round(this.state.amountAvailable - totalSpend);
    }

    return graphDat;
  }

  async onRefresh() {
    this.setState({
      isRefreshing: true,
    });
    this.renderCurrentTransactions();
    this.getAllAsyncStorageData();
    wait(2000).then(() => this.setState({isRefreshing: false}));
  }

  render() {
    const {height, width} = Dimensions.get('window');
    const sliceColors = [
      '#4CAF50',
      '#2196F3',
      '#F44336',
      '#FFEB3B',
      '#FF9800',
      '#663399',
      '#5ce8ed',
      '#6ff542',
      '#bdb76b',
      '#ee82ee',
      '#8b0000',
      '#696969',
      '#f0e68c',
      '#8b4513',
      '#9acd32',
      '#252b29',
    ];

    console.log('RENDER');
    return (
      <ScrollView
        style={{backgroundColor: '#cccccc32'}}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={async () => await this.onRefresh()}
          />
        }>
        <Overlay
          isVisible={this.state.isModalVisible}
          overlayStyle={{width: width * 0.7}}
          onBackdropPress={() => this.setState({isModalVisible: false})}>
          <View>
            <Text style={[styles.text, styles.textSubHeading]}>
              Ausgabe hinzufügen
            </Text>
            <Text style={styles.text}>Betrag</Text>
            <Input
              placeholder="Betrag"
              keyboardType="numbers-and-punctuation"
              onChangeText={(amount) => this.setState({dialogAmount: amount})}
              onBlur={() => Keyboard.dismiss()}
            />
            <Text style={styles.text}>Datum</Text>
            <DateTimeInput
              onDateChanged={(date) => this.setState({dialogDateTime: date})}
            />
            <Text style={styles.text}>Kategorie</Text>
            <Picker
              selectedValue={this.state.dialogCategory}
              itemStyle={[styles.text, {fontSize: 20}]}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({dialogCategory: itemValue.toString()});
                Keyboard.dismiss();
              }}>
              {this.state.categories.map((value, index) => (
                <Picker.Item
                  key={index}
                  label={value}
                  value={value}
                  color={'#707070'}
                />
              ))}
            </Picker>
            <Button title="Hinzufügen" onPress={() => this.addExpense()} />
          </View>
        </Overlay>

        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View>
            <Text style={[styles.textHeading]}>Monats Kosten Übersicht</Text>
            <Text style={styles.text}>
              {moment().locale('de').format('MMMM YYYY')}
            </Text>
          </View>
          {/* <Button title="Delete" onPress={() => this.dropTable()} /> */}

          <VictoryPie
            animate={{easing: 'exp'}}
            data={this.getGraphData()}
            width={width * 0.9}
            padding={10}
            innerRadius={width * 0.15}
            padAngle={1}
            colorScale={sliceColors}
            cornerRadius={10}
            standalone={true}
            labels={() => null}
          />
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 50,
            marginBottom: 10,
            alignSelf: 'flex-end',

            paddingRight: 20,
          }}
          onPress={() => {
            console.log('press'), this.setState({isModalVisible: true});
          }}>
          <Icon
            name="plus"
            type="font-awesome"
            size={25}
            reverse
            color="blue"
          />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <VictoryLegend
            colorScale={sliceColors}
            data={this.getLegendData()}
            orientation="horizontal"
            itemsPerRow={this.state.showLabels ? 2 : 3}
            gutter={40}
            borderPadding={{bottom: 0, left: 10, right: 5}}
            width={width}
            symbolSpacer={15}
          />
        </View>
      </ScrollView>
    );
  }
}
