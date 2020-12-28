import * as React from 'react';
import {Component} from 'react';
import {
  Alert,
  Button,
  Keyboard,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon, Input, Overlay} from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import {RecurringTransaction} from '../../types/types';
import {styles} from '../HomeScene/styles';

export interface RecuringTransactionsProps {}

export interface RecuringTransactionsState {
  addRecurringTransactionAmount: number;
  addRecurringTransactionDescription: string;
  recurringTransactions: RecurringTransaction[];
  showRecurringTransactionAddDialog: boolean;
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

          console.log(transactions);
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
          console.log('successfully added to recurring table'),
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

  componentDidMount() {
    this.getRecurringData();
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <View style={{flex: 1}}>
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
              keyboardType="numbers-and-punctuation"
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
          <Icon type="font-awesome" name="plus" reverse />
          <Text>Hinzufügen</Text>
        </TouchableOpacity>
        <View style={{padding: 10, flex: 1}}>
          <FlatList
            data={this.state.recurringTransactions}
            showsVerticalScrollIndicator={true}
            renderItem={({item, index}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  backgroundColor: '#cccccc20',
                  marginBottom: 5,
                  alignItems: 'center',
                  elevation: 1,
                  shadowColor: 'black',
                  borderRadius: 10,
                }}>
                <Text style={[styles.text]}>
                  {item.description} : {item.amount} €
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                  }}
                  onPress={() => this.deleteRecurringTransaction(item.id)}>
                  <Text style={[styles.text, {color: 'red'}]}>Löschen</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}
