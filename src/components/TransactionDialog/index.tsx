import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Keyboard, Dimensions} from 'react-native';
import {Overlay, Input, Button} from 'react-native-elements';
import DateTimeInput from '../DateTimeInput';
import {tags} from '../../../assets/defaultTags.json';
import {styles} from '../../scenes/HomeScene/styles';
import moment from 'moment';
import {Transaction} from '../../types/types';

export interface TransactionDialogProps {
  isVisible: boolean;
  onCloseRequested: () => void;
  onFinish: (amount: number, category: string, date: Date) => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  submitButtonText?: string;
  triggerRerender?: () => void;
  dataToDisplay?: Transaction;
}

export interface TransactionDialogState {
  amount: string;
  selectedCategory: string;
  selectedDate: Date;
  categories: string[];
  elementId: number;
}

class TransactionDialog extends Component<
  TransactionDialogProps,
  TransactionDialogState
> {
  readonly state: TransactionDialogState = {
    amount: '',
    selectedCategory: '',
    selectedDate: moment().toDate(),
    categories: tags,
    elementId: undefined,
  };

  componentDidMount() {
    AsyncStorage.getItem('customCategories')
      .then((value) => {
        if (value !== null) {
          const customCategories = [...new Set<string>(JSON.parse(value))];
          this.setState({
            categories: [...customCategories, ...new Set<string>(tags)],
          });
        }
      })
      .catch((e) => {
        console.log('error');
      });
  }

  componentDidUpdate() {
    if (this.props.dataToDisplay) {
      if (this.props.dataToDisplay.id !== this.state.elementId) {
        this.setState({elementId: this.props.dataToDisplay.id});
        if (this.state.amount !== this.props.dataToDisplay.amount.toString()) {
          this.setState({amount: this.props.dataToDisplay.amount.toString()});
        }
        if (this.state.selectedCategory !== this.props.dataToDisplay.tag) {
          this.setState({selectedCategory: this.props.dataToDisplay.tag});
        }
        if (this.state.selectedDate !== this.props.dataToDisplay.createdAt) {
          this.setState({selectedDate: this.props.dataToDisplay.createdAt});
        }
      }
    }
  }

  onClose() {
    this.setState(
      {
        amount: '',
        selectedDate: moment().toDate(),
        selectedCategory: '',
        elementId: undefined,
      },
      () => this.props.onCloseRequested(),
    );
  }

  onSubmit() {
    this.props.onFinish(
      this.validateAmountInput(),
      this.state.selectedCategory,
      this.state.selectedDate,
    );
    if (this.props.triggerRerender) {
      if (
        moment(this.state.selectedDate).isSameOrAfter(moment().startOf('month'))
      ) {
        this.props.triggerRerender();
      }
    }
    this.onClose();
  }

  validateAmountInput(): number {
    const amount = parseFloat(this.state.amount.replace(',', '.'));

    if (amount == null || isNaN(amount)) {
      return 0;
    }
    return amount;
  }

  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <Overlay
        isVisible={this.props.isVisible}
        overlayStyle={{width: width * 0.7}}
        onBackdropPress={() => this.onClose()}>
        <View>
          <Text style={[styles.text, styles.textSubHeading]}>
            Ausgabe hinzufügen
          </Text>
          <Text style={styles.text}>Betrag</Text>
          <Input
            placeholder="Betrag"
            keyboardType="numeric"
            value={this.state.amount}
            onChangeText={(amount) => this.setState({amount})}
            onBlur={() => Keyboard.dismiss()}
          />
          <Text style={styles.text}>Datum</Text>
          <DateTimeInput
            initialDate={
              this.props.dataToDisplay
                ? moment(this.props.dataToDisplay.createdAt).toDate()
                : new Date()
            }
            onDateChanged={(date) => this.setState({selectedDate: date})}
          />
          <Text style={styles.text}>Kategorie</Text>
          <Picker
            selectedValue={this.state.selectedCategory}
            itemStyle={[styles.text, {fontSize: 20}]}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({selectedCategory: itemValue.toString()});
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
          <Button
            title={
              this.props.submitButtonText
                ? this.props.submitButtonText
                : 'Hinzufügen'
            }
            onPress={() => this.onSubmit()}
          />
          {this.props.showDeleteButton && (
            <View style={{marginTop: 10}}>
              <Button
                title="Löschen"
                buttonStyle={{backgroundColor: 'red'}}
                onPress={() => this.props.onDelete()}
              />
            </View>
          )}
        </View>
      </Overlay>
    );
  }
}

export default TransactionDialog;
