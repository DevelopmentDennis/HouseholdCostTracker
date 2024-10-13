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
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {VictoryLegend, VictoryPie} from 'victory-native';
import SQLite from 'react-native-sqlite-storage';
import {styles} from './styles';
import {tags} from '../../../assets/defaultTags.json';
import 'moment/locale/de';
import {
  GraphFormat,
  LegendFormat,
  RecurringTransaction,
  sliceColors,
  STORE_CUSTOM_CATEGORIES,
  STORE_HIDE_RECURRING,
  STORE_MONTHLY_AVAILABLE,
  Transaction,
} from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackPressHandler from '../../components/BackPressHandler';
import Svg from 'react-native-svg';
import TransactionDialog from '../../components/TransactionDialog';
import {KeyValuePair} from '@react-native-async-storage/async-storage/lib/typescript/types';
import {DatabaseName} from '../../database';
import {ColorType, getColor} from '../../styles/styles';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../navigation/NavBar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';

const dbParams: SQLite.DatabaseParams = {name: DatabaseName};

const db = SQLite.openDatabase(
  dbParams,
  () => null,
  () => null,
);

type HomeSceneProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface HomeScreenState {
  isModalVisible: boolean;
  defaultGraphicData: any;
  elementsToDisplay: Transaction[];
  amountAvailable: number;
  amountRecurring: number;
  isRefreshing: boolean;
  categories: string[];
  didLoadAllData: boolean;
  hideRecurringTransactions: boolean;
}

const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default class HomeScene extends Component<
  HomeSceneProps,
  HomeScreenState
> {
  isDarkMode = this.props.route.params?.isDarkMode;

  readonly state: HomeScreenState = {
    defaultGraphicData: [{y: 0}, {y: 0}, {y: 100}],
    isModalVisible: false,
    elementsToDisplay: [],
    amountAvailable: 0,
    amountRecurring: 0,
    isRefreshing: false,
    categories: tags,
    didLoadAllData: false,
    hideRecurringTransactions: false,
  };

  private async getAllAsyncStorageData() {
    let values: readonly KeyValuePair[];
    try {
      values = await AsyncStorage.multiGet([
        STORE_MONTHLY_AVAILABLE,
        STORE_HIDE_RECURRING,
        STORE_CUSTOM_CATEGORIES,
      ]);

      if (values[0][1]) {
        const amount = Number.parseInt(values[0][1]);
        if (!isNaN(amount)) {
          this.setState({
            amountAvailable: amount,
          });
        }
      }
      if (values[1][1]) {
        this.setState({hideRecurringTransactions: values[1][1] === 'false'});
      }
      if (values[2][1]) {
        const customCategories = [...new Set<string>(JSON.parse(values[2][1]))];
        this.setState({
          categories: [...customCategories, ...new Set<string>(tags)],
        });
      }
    } catch (e) {
      console.log('error getting items from async storage');
    }
  }

  async componentDidMount() {
    try {
      db.transaction(tx => {
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
    await this.getAllAsyncStorageData();
    this.renderCurrentTransactions();
    this.setState({didLoadAllData: true});
  }

  private renderCurrentTransactions() {
    db.transaction(tx => {
      let transactions: Transaction[] = [];
      tx.executeSql(
        `select * from Transactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;

          for (let i = 0; i < rows.length; i++) {
            let tra: Transaction = rows.item(i);

            if (moment(tra.createdAt) >= moment().startOf('month')) {
              transactions.push({
                ...rows.item(i),
              });
            }
          }
        },
        error => {
          console.log('error:', error);
          return;
        },
      );

      tx.executeSql(
        `select * from RecurringTransactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;
          let recurringtransactions: Transaction = {
            createdAt: new Date(),
            tag: 'Monatlich',
            amount: 0,
          };
          let recurringAmount: number = 0;
          if (rows.length != 0) {
            for (let i = 0; i < rows.length; i++) {
              let tra: RecurringTransaction = rows.item(i);
              recurringAmount += tra.amount;
            }

            recurringtransactions.amount = recurringAmount;

            this.setState({
              amountRecurring: recurringAmount,
            });

            if (!this.state.hideRecurringTransactions) {
              transactions.splice(0, 0, recurringtransactions);
            }

            this.setState({
              elementsToDisplay: transactions,
            });
          } else {
            this.setState({
              elementsToDisplay: transactions,
              amountRecurring: 0,
            });
          }
        },
        error => {
          console.log('error:', error);
          return false;
        },
      );
    });
  }

  public dropTable() {
    db.transaction(
      tx => {
        tx.executeSql('drop table Transactions');
      },
      error => console.log('error adding transaction'),
      () => console.log('successfully dropped table Transactions'),
    );
    return true;
  }

  addExpense(amount: number, category: string, date: Date) {
    if (amount === 0) {
      return;
    }

    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO Transactions (amount, createdAt, tag) VALUES (?, ? , ?) ',
          [amount, moment(date).format(), category],
        );
      },
      error => ToastAndroid.show(error.message, ToastAndroid.SHORT),
      () => {
        ToastAndroid.show('Ausgabe hinzugefügt', ToastAndroid.SHORT);
      },
    );
  }

  private checkColorBrightness(color: string): string {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 90) {
      return 'lightgray';
    }
    return 'black';
  }

  getLegendData(): LegendFormat[] {
    let stringDat: LegendFormat[] = [];
    if (this.state.amountAvailable > 0) {
      stringDat.push({name: 'Verfügbar'});
    }
    this.state.elementsToDisplay.forEach(el => {
      if (!stringDat.find(e => e.name == el.tag)) {
        stringDat.push({name: el.tag});
      }
    });

    return stringDat;
  }

  getGraphData(): GraphFormat[] {
    let graphDat: GraphFormat[] = [];

    if (this.state.amountAvailable > 0) {
      graphDat.push({x: 'Verfügbar', y: 0});
    }
    this.state.elementsToDisplay.forEach(el => {
      if (graphDat.find(e => e.x == el.tag)) {
        const index = graphDat.findIndex(ind => ind.x == el.tag);
        const data = graphDat.find(da => da.x == el.tag);
        if (data != null) {
          graphDat[index].y = Math.round(data.y + el.amount);
        }
      } else {
        graphDat.push({x: el.tag, y: el.amount});
      }
    });

    if (this.state.amountAvailable > 0) {
      let totalSpend: number = 0;
      graphDat.forEach(el => (totalSpend += el.y));

      const amountRecurringNotInGraph = this.state.hideRecurringTransactions
        ? this.state.amountRecurring
        : 0;

      graphDat[0].y = Math.round(
        this.state.amountAvailable - totalSpend - amountRecurringNotInGraph,
      );
    }

    return graphDat;
  }

  async onRefresh() {
    this.setState({
      isRefreshing: true,
    });
    this.renderCurrentTransactions();
    await this.getAllAsyncStorageData();
    wait(2000).then(() => this.setState({isRefreshing: false}));
  }

  render() {
    const {height, width} = Dimensions.get('window');
    const graphDat = this.getGraphData();

    return (
      <ScrollView
        style={{
          backgroundColor: getColor(ColorType.background, this.isDarkMode),
        }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={async () => await this.onRefresh()}
          />
        }>
        {this.state.didLoadAllData && (
          <TransactionDialog
            transactionDialogType="Create"
            isVisible={this.state.isModalVisible}
            onCloseRequested={() => this.setState({isModalVisible: false})}
            onFinish={this.addExpense}
            triggerRerender={() => this.renderCurrentTransactions()}
            isDarkMode={this.isDarkMode}
          />
        )}

        <BackPressHandler />

        <View
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text
              style={[
                styles.textHeading,
                {
                  textAlign: 'center',
                  color: getColor(ColorType.textDefault, this.isDarkMode),
                },
              ]}>
              Monats Kosten Übersicht
            </Text>
            <Text
              style={[
                styles.text,
                {
                  color: getColor(ColorType.textDefault, this.isDarkMode),
                },
              ]}>
              {moment().locale('de').format('MMMM YYYY')}
            </Text>
            {this.state.amountAvailable > 0 && (
              <Text
                style={[
                  styles.text,
                  {
                    color: getColor(ColorType.textDefault, this.isDarkMode),
                  },
                ]}>{`noch ${graphDat[0].y}€ verfügbar`}</Text>
            )}
          </View>
          {/* <Button title="Delete" onPress={() => this.dropTable()} /> */}
          {this.state.elementsToDisplay.length === 0 && (
            <View style={{marginTop: 50, marginBottom: 50}}>
              <Text style={{fontSize: 17}}>Noch nichts anzuzeigen</Text>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: 'gray',
                  fontSize: 16,
                  textAlign: 'center',
                }}
                onPress={() => this.setState({isModalVisible: true})}>
                Ausgabe hinzufügen
              </Text>
            </View>
          )}
          {this.state.elementsToDisplay.length === 0 && (
            <ActivityIndicator size="large" />
          )}
          {this.state.elementsToDisplay.length > 0 && (
            <Svg style={{flex: 1}} height={width}>
              <VictoryPie
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        return [
                          {
                            target: 'labels',
                            mutation: props => {
                              return !!props.text
                                ? {text: ''}
                                : {
                                    text: `${
                                      props?.slice?.data?.xName
                                    }\n${Number(props.slice?.data?.y).toFixed(
                                      2,
                                    )}€`,
                                    style: {
                                      fill: this.checkColorBrightness(
                                        sliceColors[props.index],
                                      ),
                                      fontSize: 20,
                                      fontWeight: 600,
                                    },
                                  };
                            },
                          },
                        ];
                      },
                    },
                  },
                ]}
                animate={{easing: 'exp'}}
                data={graphDat}
                width={width * 0.9}
                labelRadius={width * 0.2}
                padding={10}
                style={{
                  labels: {fontSize: 20, fill: 'black', fontWeight: 600},
                }}
                innerRadius={width * 0.15}
                padAngle={1}
                colorScale={sliceColors}
                cornerRadius={10}
                standalone={true}
                labels={() => null}
              />
            </Svg>
          )}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              borderRadius: 50,
              marginBottom: 10,
              paddingLeft: 20,
              zIndex: 100,
              marginTop: -10,
            }}
            onPress={async () => {
              await this.onRefresh();
            }}>
            <Icon
              name="sync"
              type="font-awesome-5"
              size={25}
              reverse
              color="gray"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderRadius: 50,
              marginBottom: 10,

              zIndex: 100,
              marginTop: -10,
              paddingRight: 20,
            }}
            onPress={() => {
              this.setState({isModalVisible: true});
            }}>
            <Icon
              name="plus"
              type="font-awesome"
              size={25}
              reverse
              color={getColor(ColorType.buttonHighlight, this.isDarkMode)}
            />
          </TouchableOpacity>
        </View>
        {this.state.elementsToDisplay.length > 0 && (
          <VictoryLegend
            colorScale={sliceColors}
            data={this.getLegendData()}
            style={{
              labels: {
                fontSize: 16,
                fill: getColor(ColorType.textDefault, this.isDarkMode),
              },
            }}
            orientation="horizontal"
            itemsPerRow={2}
            gutter={40}
            height={height * 0.45}
            borderPadding={{bottom: 0, left: 10, right: 5}}
            width={width}
            symbolSpacer={15}
          />
        )}
      </ScrollView>
    );
  }
}
