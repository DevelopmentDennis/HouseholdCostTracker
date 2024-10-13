import * as React from 'react';
import {Component} from 'react';
import {View, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {ScrollView, GestureHandlerRootView} from 'react-native-gesture-handler';
import {licenses} from '../../../assets/licenses.json';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {ColorType, getColor, getTextColor} from '../../styles/styles';

type LicensesProps = NativeStackScreenProps<RootStackParamList, 'Licenses'>;

interface LicensesState {
  showLicenseText: boolean;
}

export default class LicensesScene extends Component<
  LicensesProps,
  LicensesState
> {
  isDarkMode = this.props.route.params?.isDarkMode;

  readonly state: LicensesState = {
    showLicenseText: false,
  };

  render() {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: getColor(ColorType.background, this.isDarkMode),
          }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 20,
              padding: 10,
              color: getTextColor(this.isDarkMode),
            }}>
            Alle nachfolgenden Bibliotheken wurden unter der{' '}
            <Text
              style={{
                textDecorationLine: 'underline',
                color: getColor(ColorType.buttonHighlight, this.isDarkMode),
              }}
              onPress={() =>
                this.setState({showLicenseText: !this.state.showLicenseText})
              }>
              MIT Lizenz
            </Text>{' '}
            veröffentlicht
          </Text>

          {this.state.showLicenseText && (
            <ScrollView
              style={{
                padding: 15,
                borderWidth: 1,
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
                borderBottomColor: 'black',
                borderRadius: 10,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: getTextColor(this.isDarkMode),
                }}>
                {`MIT License

Copyright (c) 2015-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </Text>
            </ScrollView>
          )}
          <ScrollView
            style={{
              backgroundColor: getColor(
                ColorType.backgroundLighter,
                this.isDarkMode,
              ),
            }}>
            {licenses.map((element, index) => (
              <ListItem
                containerStyle={{
                  backgroundColor: getColor(
                    ColorType.backgroundLighter,
                    this.isDarkMode,
                  ),
                }}
                key={index}
                bottomDivider>
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color: getTextColor(this.isDarkMode),
                    }}>
                    {element.name}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    );
  }
}
