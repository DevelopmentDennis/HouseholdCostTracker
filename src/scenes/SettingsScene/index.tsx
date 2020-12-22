import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Button,
  Keyboard,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon, Input, Overlay} from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from '../HomeScene/styles';
import {RecurringTransaction} from '../../types/types';

interface SettingsState {
  monthlyAvailableAmount: string;
  addRecurringTransactionAmount: number;
  addRecurringTransactionDescription: string;
  recurringTransactions: RecurringTransaction[];
  showRecurringTransactionAddDialog: boolean;
  newCategory: string;
}

const db = SQLite.openDatabase('CostTracker.db');

export default class SettingsScene extends Component<null, SettingsState> {
  readonly state: SettingsState = {
    monthlyAvailableAmount: '',
    addRecurringTransactionAmount: 0,
    addRecurringTransactionDescription: '',
    recurringTransactions: [],
    showRecurringTransactionAddDialog: false,
    newCategory: '',
  };

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('monthlyAvailableAmount');
      if (value !== null) {
        this.setState({monthlyAvailableAmount: value});
      }
    } catch (error) {
      Alert.alert('error');
    }
    this.getRecurringData();
  }

  private checkAndSetAviableAmount(amount: string) {
    const data = Number.parseInt(amount);
    if (!isNaN(data)) {
      this.setState({monthlyAvailableAmount: data.toString()});
    }
    if (amount === '') {
      this.setState({monthlyAvailableAmount: ''});
    }
  }

  private checkAndSetRecurringTransactionAmount(amount: string) {
    const data = parseFloat(amount.replace(',', '.'));
    if (!isNaN(data)) {
      this.setState({addRecurringTransactionAmount: data});
    }
    if (amount === '') {
      this.setState({addRecurringTransactionAmount: 0});
    }
  }

  private async storeData() {
    try {
      if (!isNaN(Number.parseInt(this.state.monthlyAvailableAmount))) {
        await AsyncStorage.setItem(
          'monthlyAvailableAmount',
          this.state.monthlyAvailableAmount,
        );
      }
    } catch (e) {
      Alert.alert('ERROR speichern');
    }
  }

  private selectAll() {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from RecurringTransactions`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows;

          for (let i = 0; i < rows.length; i++) {
            console.log(rows.item(i));
          }
        },
        (error) => {
          console.log('error:', error);
          return false;
        },
      );
    });
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

  private async addCategory() {
    if (this.state.newCategory == '') {
      return;
    }
    const data = await AsyncStorage.getItem('customCategories');
    if (data === null) {
      await AsyncStorage.setItem(
        'customCategories',
        JSON.stringify([this.state.newCategory]),
      );
    } else {
      let categoriesArray: string[] = JSON.parse(data);
      categoriesArray.push(this.state.newCategory);

      await AsyncStorage.setItem(
        'customCategories',
        JSON.stringify([...new Set<string>(categoriesArray)]),
      );
      this.setState({newCategory: ''});
      Alert.alert('Hinzugefügt');
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

  render() {
    const {width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView style={{padding: 20, flex: 1}}>
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

        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: 'gray',
            marginBottom: 20,
          }}>
          Einstellungen
        </Text>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Text style={{marginBottom: 15}}>Monatlich verfügbares Geld</Text>
          <View
            style={{
              borderBottomColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 2,
              flexGrow: 1,
            }}>
            <Icon
              name="euro-sign"
              type="font-awesome-5"
              size={20}
              style={{marginRight: 25}}
            />
            <TextInput
              style={{fontSize: 17}}
              placeholder="Betrag"
              value={this.state.monthlyAvailableAmount}
              onChangeText={(text) => this.checkAndSetAviableAmount(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
              onBlur={() => Keyboard.dismiss()}
            />
            <Button title="Speichern" onPress={() => this.storeData()} />
          </View>

          <View style={{marginTop: 10, marginBottom: 10}}>
            <Text>Monatliche Ausgaben</Text>
            <Button
              title="Hinzufügen"
              onPress={() =>
                this.setState({showRecurringTransactionAddDialog: true})
              }
            />
          </View>

          <View
            style={{
              borderBottomColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 2,
              flexGrow: 1,
            }}>
            <Text style={styles.text}>Kategorie hinzufügen</Text>
            <TextInput
              style={{fontSize: 17}}
              placeholder="Kategorie"
              value={this.state.newCategory}
              onChangeText={(text) => this.setState({newCategory: text})}
              onSubmitEditing={() => Keyboard.dismiss()}
              onBlur={() => Keyboard.dismiss()}
            />
            <Button title="Speichern" onPress={() => this.addCategory()} />
          </View>
        </View>
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
              }}>
              <Text style={[styles.text]}>
                {item.description} : {item.amount} Euro
              </Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                  borderRadius: 5,
                  borderWidth: 2,
                  backgroundColor: 'red',
                  borderColor: 'red',
                }}
                onPress={() => this.deleteRecurringTransaction(item.id)}>
                <Text style={[styles.text, {color: 'white'}]}>Löschen</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </KeyboardAvoidingView>
    );
  }
}
