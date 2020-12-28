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
  Switch,
} from 'react-native';
import {Icon, Input, Overlay} from 'react-native-elements';

import AsyncStorage from '@react-native-community/async-storage';
import {styles} from '../HomeScene/styles';
import {RecurringTransaction} from '../../types/types';
import {Actions} from 'react-native-router-flux';

interface SettingsState {
  monthlyAvailableAmount: string;

  newCategory: string;
  showAmountLabels: boolean;
}

export default class SettingsScene extends Component<null, SettingsState> {
  readonly state: SettingsState = {
    monthlyAvailableAmount: '',

    newCategory: '',
    showAmountLabels: false,
  };

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('monthlyAvailableAmount');
      if (value !== null) {
        this.setState({monthlyAvailableAmount: value});
      }
      const showLabels = await AsyncStorage.getItem('showAmountLabels');
      if (showLabels !== null) {
        this.setState({showAmountLabels: showLabels === 'true'});
      }
    } catch (error) {
      Alert.alert('error');
    }
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

  private async updateShowAmountLabels() {
    await AsyncStorage.setItem(
      'showAmountLabels',
      `${this.state.showAmountLabels}`,
    );
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

  render() {
    const {width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView style={{padding: 20, flex: 1}}>
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
            <Button
              title="Speichern"
              onPress={() => {
                this.storeData();
                Keyboard.dismiss();
              }}
            />
          </View>

          <Button onPress={() => Actions.jump('licenses')} title="Lizenzen" />
          {/* <View style={{marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
            <Text>Betrag anzeigen</Text>
            <Switch
              onValueChange={() =>
                this.setState(
                  {showAmountLabels: !this.state.showAmountLabels},
                  () => this.updateShowAmountLabels(),
                )
              }
              value={this.state.showAmountLabels}
            />
          </View> */}

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
        <Button
          title="Monatliche Ausgaben"
          onPress={() => Actions.jump('recurring')}
        />
        <Text>Version 1.0</Text>
      </KeyboardAvoidingView>
    );
  }
}
