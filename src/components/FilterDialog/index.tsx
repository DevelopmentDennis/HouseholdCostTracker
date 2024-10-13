import * as React from 'react';
import {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {styles} from '../../scenes/HomeScene/styles';
import {ColorType, DarkMode, getColor, getTextColor} from '../../styles/styles';

interface FilterDialogProps extends DarkMode {
  isVisible: boolean;
  onClose: () => void;
  onOrderByDesc: () => void;
  onOrderByAsc: () => void;
}

class FilterDialog extends Component<FilterDialogProps> {
  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <Overlay
        isVisible={this.props.isVisible}
        overlayStyle={{
          width: width * 0.7,
          height: height * 0.3,
          overflow: 'hidden',
          backgroundColor: getColor(
            ColorType.background,
            this.props.isDarkMode,
          ),
        }}
        onBackdropPress={() => this.props.onClose()}
        onRequestClose={() => this.props.onClose()}>
        <View
          style={{
            flexGrow: 1,
          }}>
          <Text
            style={[
              styles.text,
              styles.textSubHeading,
              {color: getTextColor(this.props.isDarkMode)},
            ]}>
            Ausgaben filtern
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flexGrow: 1,
              marginTop: 25,
            }}>
            <View>
              <Button
                title={'Neuste zuerst'}
                onPress={this.props.onOrderByDesc}
              />
            </View>
            <View style={{margin: 5}} />
            <View>
              <Button
                title={'Älteste zuerst'}
                onPress={this.props.onOrderByAsc}
              />
            </View>
          </View>
        </View>
      </Overlay>
    );
  }
}

export default FilterDialog;
