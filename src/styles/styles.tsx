import {StyleSheet} from 'react-native';

export interface Colors {}

export const globalStyles = StyleSheet.create({
  rowContainerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
});
