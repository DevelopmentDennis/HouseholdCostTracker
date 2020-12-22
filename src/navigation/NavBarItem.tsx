import React from 'react';
import {Text, TouchableOpacity, StyleProp, ViewStyle, View} from 'react-native';
import {Icon} from 'react-native-elements';

export interface NavBarItemProps {
  iconType: string;
  iconName: string;
  iconSize?: number;
  pageName?: string;
  active: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: (ev: any) => void;
  children?: any;
}

export default (props: NavBarItemProps) => {
  return (
    <TouchableOpacity
      style={{flexDirection: 'column', alignItems: 'center'}}
      onPress={props.onPress}>
      <View>
        <Icon
          type={props.iconType}
          name={props.iconName}
          size={props.iconSize ? props.iconSize : 25}
          color={props.active ? 'blue' : 'gray'}
        />

        {props.children}
      </View>

      {props.pageName != null && (
        <Text
          style={props.active ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>
          {props.pageName}
        </Text>
      )}
    </TouchableOpacity>
  );
};
