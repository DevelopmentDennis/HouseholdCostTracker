import * as React from 'react';
import {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Overlay} from 'react-native-elements';

interface FilterDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onOrderByDesc: () => void;
  onOrderByAsc: () => void;
}

interface FilterDialogState {}

class FilterDialog extends Component<FilterDialogProps, FilterDialogState> {
  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <Overlay
        isVisible={this.props.isVisible}
        overlayStyle={{width: width * 0.7, height: height * 0.5}}
        onBackdropPress={() => this.props.onClose()}>
        <View>
          <Text>Ausgaben filtern</Text>
          <View style={{marginTop: 10}}>
            <Button
              title={'Neuste zuerst'}
              onPress={this.props.onOrderByDesc}
            />
          </View>
          <View style={{marginTop: 10}}>
            <Button
              title={'Älteste zuerst'}
              onPress={this.props.onOrderByAsc}
            />
          </View>
        </View>
      </Overlay>
    );
  }
}

export default FilterDialog;
