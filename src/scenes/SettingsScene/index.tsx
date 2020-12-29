import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from 'react-native-router-flux';
import {ListItem} from 'react-native-elements';

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
      <KeyboardAvoidingView
        style={{padding: 20, flex: 1, backgroundColor: '#cccccc32'}}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <Text style={{marginBottom: 15}}>
            Monatlich verfügbarer Betrag in €
          </Text>
          <View
            style={{
              width: '100%',
              borderBottomColor: 'black',
              justifyContent: 'space-around',
              alignItems: 'center',
              backgroundColor: 'white',
              flexDirection: 'row',
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 1,
            }}>
            <TextInput
              style={{
                fontSize: 17,
                width: width * 0.4,
                paddingLeft: 25,
              }}
              placeholder="Betrag"
              value={this.state.monthlyAvailableAmount}
              onChangeText={(text) => this.checkAndSetAviableAmount(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
              onBlur={() => Keyboard.dismiss()}
            />

            <TouchableOpacity
              style={{
                borderLeftWidth: 1,
                borderLeftColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                paddingLeft: 15,
              }}
              onPress={() => {
                console.log('pressed');
                this.storeData();
                Keyboard.dismiss();
              }}>
              <Text>Speichern</Text>
            </TouchableOpacity>
          </View>

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

          <Text style={{marginBottom: 15, marginTop: 20}}>
            Eigene Kategorie hinzufügen
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              borderBottomColor: 'black',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 1,
            }}>
            <TextInput
              style={{
                fontSize: 17,
                width: width * 0.4,
                paddingLeft: 25,
              }}
              placeholder="Kategorie"
              value={this.state.newCategory}
              onChangeText={(text) => this.checkAndSetAviableAmount(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
              onBlur={() => Keyboard.dismiss()}
            />

            <TouchableOpacity
              style={{
                borderLeftWidth: 1,
                borderLeftColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                paddingLeft: 15,
              }}
              onPress={() => {
                console.log('pressed2');
                this.addCategory();
              }}>
              <Text>Speichern</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', marginTop: 20}}>
            <ListItem
              bottomDivider
              topDivider
              style={{backgroundColor: '#cccccc32'}}
              onPress={() => Actions.jump('recurring')}>
              <ListItem.Content>
                <ListItem.Title>Monatliche Ausgaben</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem bottomDivider onPress={() => Actions.jump('licenses')}>
              <ListItem.Content>
                <ListItem.Title>Verwendete Bibliotheken</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </View>
        <View style={{flex: 1, bottom: 0}}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Version 1.0</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
