import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import {RootStackParamList} from '../../navigation';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootTabParamList} from '../../navigation/NavBar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ColorType, getColor, getTextColor} from '../../styles/styles';

type SettingsSceneProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default class SettingsScene extends Component<SettingsSceneProps> {
  isDarkMode = this.props.route.params?.isDarkMode;
  render() {
    return (
      <KeyboardAvoidingView
        style={{
          padding: 20,
          flex: 1,
          backgroundColor: getColor(ColorType.background, this.isDarkMode),
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
          <View style={{width: '100%', marginTop: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 15,
                fontSize: 20,
                textAlign: 'left',
                color: getTextColor(this.isDarkMode),
              }}>
              Einstellungen
            </Text>

            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() =>
                this.props.navigation.navigate('MonthlyAvailable')
              }>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Monatlich verfügbares Geld
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() => this.props.navigation.navigate('Recurring')}>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Monatliche Ausgaben
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() => this.props.navigation.navigate('Categories')}>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Eigene Kategorien
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() => this.props.navigation.navigate('OtherSettings')}>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Sonstige Einstellungen
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              bottomDivider
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() => this.props.navigation.navigate('Licenses')}>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Verwendete Bibliotheken
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{
                backgroundColor: getColor(
                  ColorType.backgroundLighter,
                  this.isDarkMode,
                ),
              }}
              onPress={() => this.props.navigation.navigate('Privacy')}>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    color: getTextColor(this.isDarkMode),
                  }}>
                  Datenschutz
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        </View>
        <View style={{flexGrow: 1}}></View>
        <View>
          <ListItem
            containerStyle={{
              backgroundColor: getColor(
                ColorType.backgroundLighter,
                this.isDarkMode,
              ),
            }}>
            <ListItem.Content>
              <ListItem.Title
                style={{
                  color: getTextColor(this.isDarkMode),
                }}>
                App-Version 2.1.1
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
