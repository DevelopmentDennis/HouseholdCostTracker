import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker as SelectPicker} from '@react-native-picker/picker';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Keyboard, Dimensions} from 'react-native';
import {Overlay, Input, Button} from 'react-native-elements';
import DateTimeInput from '../DateTimeInput';
import {tags} from '../../../assets/defaultTags.json';
import {styles} from '../../scenes/HomeScene/styles';
import moment from 'moment';
import {STORE_CUSTOM_CATEGORIES, Transaction} from '../../types/types';
import {ColorType, DarkMode, getColor, getTextColor} from '../../styles/styles';

export interface TransactionDialogProps extends DarkMode {
  isVisible: boolean;
  onCloseRequested: () => void;
  onFinish: (amount: number, category: string, date: Date) => void;
  onDelete?: (id?: number) => void;
  submitButtonText?: string;
  triggerRerender?: () => void;
  transactionDialogType: 'Edit' | 'Create';
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
    elementId: NaN,
  };

  componentDidMount() {
    console.log(this.props.isDarkMode);
    this.getCustomCategories();
  }

  componentDidUpdate(prevProps: TransactionDialogProps) {
    if (this.props.dataToDisplay) {
      if (this.props.dataToDisplay.id !== this.state.elementId) {
        this.setState({elementId: this.props.dataToDisplay.id as number});
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
    if (this.props.isVisible && !prevProps.isVisible) {
      this.getCustomCategories();
    }
  }

  getCustomCategories() {
    AsyncStorage.getItem(STORE_CUSTOM_CATEGORIES)
      .then(value => {
        if (value !== null) {
          const customCategories = [...new Set<string>(JSON.parse(value))];
          this.setState({
            categories: [...customCategories, ...new Set<string>(tags)],
          });
        }
      })
      .catch(e => {
        console.log('error');
      });
  }

  onClose() {
    this.setState(
      {
        amount: '',
        selectedDate: moment().toDate(),
        selectedCategory: '',
        elementId: NaN,
      },
      () => this.props.onCloseRequested(),
    );
  }

  validateCategory() {
    if (this.state.selectedCategory !== '') {
      return this.state.selectedCategory;
    }
    return this.state.categories[0];
  }

  onSubmit() {
    Keyboard.dismiss();
    this.props.onFinish(
      this.validateAmountInput(),
      this.validateCategory(),
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
    const {width} = Dimensions.get('window');
    return (
      <Overlay
        isVisible={this.props.isVisible}
        overlayStyle={{
          width: width * 0.7,
          backgroundColor: getColor(
            ColorType.backgroundLighter,
            this.props.isDarkMode,
          ),
        }}
        onBackdropPress={() => this.onClose()}>
        <View>
          <Text
            style={[
              styles.text,
              styles.textSubHeading,
              {color: getTextColor(this.props.isDarkMode)},
            ]}>
            {this.props.transactionDialogType === 'Create'
              ? 'Ausgabe hinzufügen'
              : 'Ausgabe bearbeiten'}
          </Text>
          <Text
            style={[styles.text, {color: getTextColor(this.props.isDarkMode)}]}>
            Betrag
          </Text>
          <Input
            placeholderTextColor={getColor(
              ColorType.textInput,
              this.props.isDarkMode,
            )}
            inputStyle={{
              color: getColor(ColorType.textInput, this.props.isDarkMode),
            }}
            keyboardAppearance={this.props.isDarkMode ? 'dark' : 'default'}
            placeholder="Betrag"
            keyboardType={'numeric'}
            value={this.state.amount}
            onChangeText={amount => this.setState({amount})}
            onBlur={() => Keyboard.dismiss()}
          />
          <Text
            style={[styles.text, {color: getTextColor(this.props.isDarkMode)}]}>
            Datum
          </Text>
          <DateTimeInput
            initialDate={
              this.props.dataToDisplay
                ? moment(this.props.dataToDisplay.createdAt).toDate()
                : new Date()
            }
            onDateChanged={date => this.setState({selectedDate: date})}
            isDarkMode={this.props.isDarkMode}
          />
          <Text
            style={[styles.text, {color: getTextColor(this.props.isDarkMode)}]}>
            Kategorie
          </Text>
          <SelectPicker
            selectedValue={this.state.selectedCategory}
            style={{
              backgroundColor: getColor(
                ColorType.backgroundLighter,
                this.props.isDarkMode,
              ),
            }}
            mode="dropdown"
            itemStyle={[
              styles.text,
              {
                fontSize: 20,
                color: getTextColor(this.props.isDarkMode),
              },
            ]}
            onValueChange={itemValue => {
              this.setState({selectedCategory: itemValue.toString()});
              Keyboard.dismiss();
            }}>
            {this.state.categories.map((value, index) => (
              <SelectPicker.Item
                style={{
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.props.isDarkMode,
                  ),
                }}
                key={index}
                label={value}
                value={value}
                color={getColor(ColorType.textInput, this.props.isDarkMode)}
              />
            ))}
          </SelectPicker>
          <Button
            title={
              this.props.submitButtonText
                ? this.props.submitButtonText
                : 'Hinzufügen'
            }
            onPress={() => this.onSubmit()}
          />
          {this.props.transactionDialogType === 'Edit' && (
            <View style={{marginTop: 10}}>
              <Button
                title="Löschen"
                buttonStyle={{
                  backgroundColor: getColor(
                    ColorType.cancel,
                    this.props.isDarkMode,
                  ),
                }}
                onPress={() => {
                  if (this.props.onDelete) {
                    this.props.onDelete(this.props.dataToDisplay?.id);
                  }
                  this.props.onCloseRequested();
                }}
              />
            </View>
          )}
        </View>
      </Overlay>
    );
  }
}

export default TransactionDialog;
