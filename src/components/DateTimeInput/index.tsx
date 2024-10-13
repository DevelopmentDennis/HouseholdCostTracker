import * as React from 'react';
import {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {ColorType, DarkMode, getColor} from '../../styles/styles';

export interface DateTimeInputProps extends DarkMode {
  onDateChanged: (date: Date) => void;
  initialDate: Date;
}

export interface DateTimeInputState {
  isDatePickerVisible: boolean;
  date: Date;
}

class DateTimeInput extends Component<DateTimeInputProps, DateTimeInputState> {
  readonly state: DateTimeInputState = {
    isDatePickerVisible: false,
    date: this.props.initialDate,
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setState({isDatePickerVisible: true})}>
          <Input
            style={{
              color: getColor(ColorType.textInput, this.props.isDarkMode),
            }}
            readOnly
            value={moment(this.state.date).format('DD.MM.YYYY')}
          />
        </TouchableOpacity>

        {this.state.isDatePickerVisible && (
          <DateTimePicker
            value={this.state.date}
            textColor={getColor(ColorType.textInput, this.props.isDarkMode)}
            mode="date"
            maximumDate={moment().toDate()}
            is24Hour={true}
            display="default"
            onChange={(event, value) => {
              if (value != null && moment(value).isValid()) {
                this.setState({date: value, isDatePickerVisible: false}),
                  this.props.onDateChanged(value);
              } else {
                this.setState({isDatePickerVisible: false});
              }
            }}
          />
        )}
      </View>
    );
  }
}

export default DateTimeInput;
