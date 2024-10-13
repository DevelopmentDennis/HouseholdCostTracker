import {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORE_MONTHLY_AVAILABLE} from '../../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {ColorType, getColor, getTextColor} from '../../styles/styles';

type MonthlyAvailableSceneProps = NativeStackScreenProps<
  RootStackParamList,
  'MonthlyAvailable'
>;

export interface MonthlyAvailableSceneState {
  monthlyAvailableAmount: string;
}

class MonthlyAvailableScene extends Component<
  MonthlyAvailableSceneProps,
  MonthlyAvailableSceneState
> {
  isDarkMode = this.props.route.params?.isDarkMode;

  readonly state: MonthlyAvailableSceneState = {
    monthlyAvailableAmount: '0',
  };

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem(STORE_MONTHLY_AVAILABLE);
      if (value !== null) {
        this.setState({monthlyAvailableAmount: value});
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

  private async storeData() {
    if (!isNaN(Number.parseInt(this.state.monthlyAvailableAmount))) {
      AsyncStorage.setItem(
        STORE_MONTHLY_AVAILABLE,
        this.state.monthlyAvailableAmount,
      )
        .then(() =>
          ToastAndroid.show('Erfolgreich gespeichert', ToastAndroid.SHORT),
        )
        .catch(error => Alert.alert(`Es ist ein Fehler aufgetreten ${error}`));
    }
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <KeyboardAvoidingView
        style={{
          padding: 15,
          flex: 1,
          backgroundColor: getColor(ColorType.background, this.isDarkMode),
        }}>
        <Text
          style={{
            marginBottom: 15,
            fontSize: 16,
            color: getTextColor(this.isDarkMode),
          }}>
          Monatlich verfügbarer Betrag in €
        </Text>
        <View
          style={{
            width: '100%',
            borderBottomColor: 'black',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            borderColor: 'black',
            backgroundColor: getColor(
              ColorType.backgroundLighter,
              this.isDarkMode,
            ),
            borderWidth: 1,
          }}>
          <TextInput
            style={{
              fontSize: 17,
              width: width * 0.4,
              paddingLeft: 25,
              color: getColor(ColorType.textInput, this.isDarkMode),
            }}
            placeholderTextColor={getColor(
              ColorType.textInput,
              this.isDarkMode,
            )}
            keyboardAppearance={this.isDarkMode ? 'dark' : 'default'}
            placeholder="Betrag"
            value={this.state.monthlyAvailableAmount}
            keyboardType={'numeric'}
            onChangeText={text => this.checkAndSetAviableAmount(text)}
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
              this.storeData();
              Keyboard.dismiss();
            }}>
            <Text style={{color: 'green'}}>Speichern</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 15,
            color: getTextColor(this.isDarkMode),
          }}>
          Tragen Sie hier den Betrag ein, der Ihnen monatlich zur Verfügung
          steht. Dies ist normalerweise Ihr Nettolohn.{'\n\n'}Jeden Monat
          gleiche Ausgaben, wie Miete, Versicherungen etc, können Sie{' '}
          <Text
            onPress={() => this.props.navigation.navigate('Recurring')}
            style={{
              textDecorationLine: 'underline',
              color: getColor(ColorType.buttonHighlight, this.isDarkMode),
            }}>
            hier
          </Text>{' '}
          eintragen.
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

export default MonthlyAvailableScene;
