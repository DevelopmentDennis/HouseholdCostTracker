import {useIsFocused} from '@react-navigation/core';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {BackHandler, ToastAndroid} from 'react-native';

export const HandleBackPress = props => {
  const {message} = props;
  const [exitApp, setExitApp] = useState(0);
  const isHomeSceneFocused = useIsFocused();
  const backAction = () => {
    if (!isHomeSceneFocused) {
      return false;
    }
    setTimeout(() => {
      setExitApp(0);
    }, 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });
  useEffect(
    () => () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction),
    [],
  );
  return <></>;
};

export default function DoubleTapToClose(props) {
  const {message = 'Nochmals drücken um zu Beenden'} = props;
  return <HandleBackPress message={message} />;
}
