import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {
  Alert,
  Keyboard,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon, Input, Overlay, Button} from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import {globalStyles} from '../../styles/styles';
import {RecurringTransaction} from '../../types/types';
import {styles} from '../HomeScene/styles';
export interface RecuringTransactionsProps {}

export interface RecuringTransactionsState {
  addRecurringTransactionAmount: number;
  addRecurringTransactionDescription: string;
  recurringTransactions: RecurringTransaction[];
  showRecurringTransactionAddDialog: boolean;
  showDefaultKeyboard: boolean;
}

const db = SQLite.openDatabase('CostTracker.db');

export default class RecuringTransactionsScene extends Component<
  RecuringTransactionsProps,
  RecuringTransactionsState
> {
  readonly state = {
    addRecurringTransactionAmount: 0,
    addRecurringTransactionDescription: '',
    recurringTransactions: [],
    showRecurringTransactionAddDialog: false,
    showDefaultKeyboard: false,
  };

  private checkAndSetRecurringTransactionAmount(amount: string) {
    const data = parseFloat(amount.replace(',', '.'));
    if (!isNaN(data)) {
      this.setState({addRecurringTransactionAmount: data});
    }
    if (amount === '') {
      this.setState({addRecurringTransactionAmount: 0});
    }
  }

  private getRecurringData(): RecurringTransaction[] {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from RecurringTransactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;
          let transactions: RecurringTransaction[] = [];

          for (let i = 0; i < rows.length; i++) {
            let tra: RecurringTransaction = rows.item(i);
            transactions.push({
              ...rows.item(i),
            });
          }

          this.setState({recurringTransactions: transactions});
        },
        (error) => {
          console.log('error:', error);
          return [];
        },
      );
    });
    return [];
  }

  private deleteRecurringTransaction(id: number) {
    db.transaction((tx) => {
      tx.executeSql(
        `delete from RecurringTransactions where id=?`,
        [id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            this.getRecurringData();
          } else {
            console.log('id not found');
          }
        },
        (error) => {
          console.log('error:', error);
        },
      );
    });
  }

  private storeRecurringData() {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO RecurringTransactions (amount, description) VALUES (?, ?) ',
            [
              this.state.addRecurringTransactionAmount,
              this.state.addRecurringTransactionDescription,
            ],
          );
        },
        (error) => console.log('error adding recurringTransaction', error),
        () => {
          this.setState({
            addRecurringTransactionAmount: 0,
            addRecurringTransactionDescription: '',
            showRecurringTransactionAddDialog: false,
          });
          this.getRecurringData();
        },
      );
    } catch (error) {
      Alert.alert('ERROR wiederkehrend speichern');
    }
  }

  getKeyboardType() {
    AsyncStorage.getItem('showDefaultKeyboardType')
      .then((value) => {
        if (value != null) {
          this.setState({showDefaultKeyboard: value === 'true'});
        }
      })
      .catch((e) => {
        console.log('error', e);
      });
  }

  componentDidMount() {
    this.getRecurringData();
    this.getKeyboardType();
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <View style={{flex: 1, backgroundColor: '#cccccc32'}}>
        <Overlay
          isVisible={this.state.showRecurringTransactionAddDialog}
          overlayStyle={{width: width * 0.7}}
          onBackdropPress={() =>
            this.setState({showRecurringTransactionAddDialog: false})
          }>
          <View>
            <Text style={[styles.text, styles.textSubHeading]}>
              Monatliche Ausgabe hinzufügen
            </Text>
            <Text style={styles.text}>Betrag</Text>
            <Input
              placeholder="Betrag"
              keyboardType={
                this.state.showDefaultKeyboard ? 'default' : 'numeric'
              }
              onChangeText={(amount) =>
                this.checkAndSetRecurringTransactionAmount(amount)
              }
            />
            <Text style={styles.text}>Beschreibung</Text>
            <Input
              placeholder="Beschreibung"
              onChangeText={(text) =>
                this.setState({addRecurringTransactionDescription: text})
              }
            />

            <Button
              title="Hinzufügen"
              onPress={() => {
                Keyboard.dismiss(), this.storeRecurringData();
              }}
            />
          </View>
        </Overlay>

        <Text style={{padding: 10, paddingTop: 25, fontSize: 15}}>
          Hier aufgeführte Ausgaben werden jeden Monat automatisch vom zur
          verfügung stehenden Geld abgezogen.
        </Text>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() =>
            this.setState({showRecurringTransactionAddDialog: true})
          }>
          <Icon type="font-awesome" name="plus" reverse color={'royalblue'} />
          <Text style={{fontSize: 17}}>Hinzufügen</Text>
        </TouchableOpacity>
        <View style={{padding: 10, flex: 1}}>
          {this.state.recurringTransactions.length === 0 && (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 17}}>Noch nichts anzuzeigen</Text>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: 'gray',
                  fontSize: 16,
                }}
                onPress={() =>
                  this.setState({showRecurringTransactionAddDialog: true})
                }>
                Monatliche Ausgabe hinzufügen
              </Text>
            </View>
          )}
          {this.state.recurringTransactions.length > 0 && (
            <FlatList
              data={this.state.recurringTransactions}
              showsVerticalScrollIndicator={true}
              renderItem={({item, index}) => (
                <View style={globalStyles.rowContainerItem}>
                  <Text style={[styles.text, {paddingLeft: 15}]}>
                    {item.description} : {item.amount} €
                  </Text>

                  <TouchableOpacity
                    style={{
                      borderLeftWidth: 1,
                      borderLeftColor: 'black',
                      paddingLeft: 15,
                    }}
                    onPress={() => this.deleteRecurringTransaction(item.id)}>
                    <Text style={[{color: 'red'}]}>Löschen</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    );
  }
}
