import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ToastAndroid,
  Button,
  Keyboard,
} from 'react-native';
import {Icon, Input, Overlay} from 'react-native-elements';
import {globalStyles} from '../../styles/styles';
import {STORE_CUSTOM_CATEGORIES} from '../../types/types';
import {styles} from '../HomeScene/styles';

interface CategoriesSceneProps {}

export interface CategoriesSceneState {
  categories: string[];
  categoryToBeAdded: string;
  addCustomCategoryDialogVisible: boolean;
}

class CategoriesScene extends Component<
  CategoriesSceneProps,
  CategoriesSceneState
> {
  readonly state: CategoriesSceneState = {
    categories: [],
    categoryToBeAdded: '',
    addCustomCategoryDialogVisible: false,
  };

  componentDidMount() {
    this.getAllAsyncStorageData();
  }

  componentWillUnmount(): void {
    this.setAllAsyncStorageData();
  }

  private getAllAsyncStorageData() {
    AsyncStorage.getItem(STORE_CUSTOM_CATEGORIES)
      .then(value => {
        if (value !== null) {
          this.setState({
            categories: [...new Set<string>(JSON.parse(value))],
          });
        }
      })
      .catch(error => console.log('error', error));
  }

  private setAllAsyncStorageData() {
    AsyncStorage.setItem(
      STORE_CUSTOM_CATEGORIES,
      JSON.stringify([...new Set<string>(this.state.categories)]),
    );
  }

  private async addCategory() {
    if (this.state.categoryToBeAdded == '') {
      return;
    }
    const data = await AsyncStorage.getItem(STORE_CUSTOM_CATEGORIES);
    if (data === null) {
      await AsyncStorage.setItem(
        STORE_CUSTOM_CATEGORIES,
        JSON.stringify([this.state.categoryToBeAdded]),
      );
    } else {
      let categoriesArray: string[] = JSON.parse(data);
      categoriesArray.push(this.state.categoryToBeAdded);

      AsyncStorage.setItem(
        STORE_CUSTOM_CATEGORIES,
        JSON.stringify([...new Set<string>(categoriesArray)]),
      )
        .then(() => {
          ToastAndroid.show('Erfolgreich hinzugefügt', ToastAndroid.SHORT),
            this.setState(state => ({
              categoryToBeAdded: '',
              addCustomCategoryDialogVisible: false,
              categories: [...state.categories, state.categoryToBeAdded],
            }));
        })
        .catch(error => {
          ToastAndroid.show(
            'Es ist ein Fehler beim Speichern aufgetreten',
            ToastAndroid.SHORT,
          ),
            this.setState({addCustomCategoryDialogVisible: false});
        });
    }
  }

  private async deleteCategory(categoryToDelete: string) {
    this.setState(
      state => ({
        categories: state.categories.filter(
          element => element != categoryToDelete,
        ),
      }),
      async () => {
        const data = await AsyncStorage.getItem(STORE_CUSTOM_CATEGORIES);
        if (data === null) {
          console.log('ERROR deleting item');
        } else {
          let categoriesArray: string[] = JSON.parse(data);
          categoriesArray = categoriesArray.filter(
            element => element != categoryToDelete,
          );

          AsyncStorage.setItem(
            STORE_CUSTOM_CATEGORIES,
            JSON.stringify([...new Set<string>(categoriesArray)]),
          ).then(() => {
            ToastAndroid.show('Erfolgreich gelöscht', ToastAndroid.SHORT);
          });
        }
      },
    );
  }

  private moveItemUp(item: string, index: number) {
    let reorderedList = this.state.categories;
    reorderedList.splice(index, 1);
    reorderedList.splice(index - 1, 0, item);

    this.setState({categories: reorderedList});
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <View style={{flex: 1, backgroundColor: '#cccccc32'}}>
        <Overlay
          isVisible={this.state.addCustomCategoryDialogVisible}
          overlayStyle={{width: width * 0.7}}
          onBackdropPress={() =>
            this.setState({addCustomCategoryDialogVisible: false})
          }>
          <View>
            <Text style={[styles.text, styles.textSubHeading]}>
              Eigene Kategorie hinzufügen
            </Text>

            <Input
              style={{marginTop: 10}}
              placeholder="Beschreibung"
              onChangeText={text => this.setState({categoryToBeAdded: text})}
            />

            <Button
              title="Hinzufügen"
              onPress={() => {
                Keyboard.dismiss(), this.addCategory();
              }}
            />
          </View>
        </Overlay>

        <Text style={{padding: 10, paddingTop: 25, fontSize: 15}}>
          Hier können eigene Kategorien hinzugefügt oder gelöscht werden. Mit
          dem Pfeil kann die Reihenfolge geändert werden.
        </Text>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => this.setState({addCustomCategoryDialogVisible: true})}>
          <Icon type="font-awesome" name="plus" reverse color={'royalblue'} />
          <Text style={{fontSize: 17}}>Hinzufügen</Text>
        </TouchableOpacity>
        <View style={{padding: 10, flex: 1}}>
          {this.state.categories.length === 0 && (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 17}}>Noch nichts anzuzeigen</Text>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: 'gray',
                  fontSize: 16,
                }}
                onPress={() =>
                  this.setState({addCustomCategoryDialogVisible: true})
                }>
                Eigene Kategorie hinzufügen
              </Text>
            </View>
          )}
          {this.state.categories.length > 0 && (
            <FlatList
              data={this.state.categories}
              showsVerticalScrollIndicator={true}
              renderItem={({item, index}) => (
                <View style={globalStyles.rowContainerItem}>
                  <Text
                    style={[
                      styles.text,
                      {
                        paddingLeft: 15,
                        maxWidth: width * 0.6,
                      },
                    ]}
                    numberOfLines={1}>
                    {item}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {index != 0 && (
                      <TouchableOpacity
                        style={{
                          borderLeftWidth: 1,
                          borderLeftColor: 'black',
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                        onPress={() => this.moveItemUp(item, index)}>
                        <Icon
                          type="font-awesome"
                          name="arrow-up"
                          color={'royalblue'}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={{
                        borderLeftWidth: 1,
                        borderLeftColor: 'black',
                        paddingLeft: 15,
                      }}
                      onPress={() => this.deleteCategory(item)}>
                      <Text style={[{color: 'red'}]}>Löschen</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    );
  }
}

export default CategoriesScene;
