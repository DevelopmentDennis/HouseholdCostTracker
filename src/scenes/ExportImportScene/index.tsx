import * as React from 'react';
import {Component} from 'react';
import {PermissionsAndroid, View} from 'react-native';
import {Button} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';

export interface ExportImportSceneProps {}

export interface ExportImportSceneState {
  loadedFileUri: string;
}

class ExportImportScene extends Component<
  ExportImportSceneProps,
  ExportImportSceneState
> {
  readonly state: ExportImportSceneState = {
    loadedFileUri: '',
  };

  async loadDocument() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState({loadedFileUri: res.uri});
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  okCallback() {
    console.log('success');
  }

  async saveDocument() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Doco App Export Database Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    const path = '/data/data/com.monthlycosttracker/databases/CostTracker.db';
    const dest = `${RNFS.DocumentDirectoryPath}/${path}`;

    RNFS.readFile(path, 'base64').then((value) =>
      RNFS.getAllExternalFilesDirs()
        .then((paths) => {
          console.log(paths);

          RNFS.writeFile(
            RNFS.DownloadDirectoryPath + '/' + 'doco_app_data_export.db',
            value,
            'base64',
          );
        })
        .then(() => console.log('Successful')),
    );

    // RNFS.copyFileAssets(path, dest)
    //   .then(() => FileViewer.open(dest, {showOpenWithDialog: true}))
    //   .then(() => {
    //     // success
    //   })
    //   .catch((error) => {
    //     console.log('error:', error);
    //   });
  }

  render() {
    return (
      <View>
        <Button onPress={() => this.loadDocument()} title="LADEN"></Button>
        <View style={{margin: 10}}></View>
        <Button onPress={() => this.saveDocument()} title="SPEICHERN" />
      </View>
    );
  }
}

export default ExportImportScene;
