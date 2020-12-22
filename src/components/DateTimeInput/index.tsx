import * as React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export interface DateTimeInputProps {
  onDateChanged: (date: Date) => void;
}

export interface DateTimeInputState {
  isDatePickerVisible: boolean;
  date: Date;
}

class DateTimeInput extends Component<DateTimeInputProps, DateTimeInputState> {
  readonly state: DateTimeInputState = {
    isDatePickerVisible: false,
    date: new Date(),
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setState({isDatePickerVisible: true})}>
          <Input
            disabled
            value={moment(this.state.date).format('DD.MM.YYYY')}></Input>
        </TouchableOpacity>

        {this.state.isDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              this.setState({date: selectedDate, isDatePickerVisible: false}),
                this.props.onDateChanged(selectedDate);
            }}
          />
        )}
      </View>
    );
  }
}

export default DateTimeInput;
