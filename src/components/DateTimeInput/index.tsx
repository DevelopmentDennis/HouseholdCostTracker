import * as React from 'react';
import {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export interface DateTimeInputProps {
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
            disabled
            value={moment(this.state.date).format('DD.MM.YYYY')}
          />
        </TouchableOpacity>

        {this.state.isDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.date}
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
