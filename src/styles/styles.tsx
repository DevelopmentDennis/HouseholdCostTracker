import {StyleSheet} from 'react-native';

export type DarkMode = {
  isDarkMode: boolean | undefined;
};

export enum ColorType {
  background,
  backgroundLighter,
  backgroundFocus,
  currentMonthYear,
  textDefault,
  textInput,
  buttonHighlight,
  cancel,
  navBar,
}

const ColorsLight = {
  background: '#cccccc32',
  backgroundLighter: 'white',
  backgroundFocus: '#e9eefc',
  currentMonthYear: '#e9eefc',
  textDefault: 'black',
  textInput: 'gray',
  buttonHighlight: 'royalblue',
  cancel: 'crimson',
  navBar: 'white',
};

const ColorsDark = {
  background: '#404040',
  backgroundLighter: '#4d4d4d',
  backgroundFocus: '#0d3300',
  currentMonthYear: '#e9eefc',
  textDefault: '#e6e6e6',
  textInput: '#999999',
  buttonHighlight: 'royalblue',
  cancel: '#a30f2d',
  navBar: '#1a1a1a',
};

export function getColor(
  target: ColorType,
  useDarkMode: boolean | undefined,
): string {
  let data: [string, string] | undefined;
  if (useDarkMode) {
    data = Object.entries(ColorsDark).at(target);
  } else {
    data = Object.entries(ColorsLight).at(target);
  }

  if (data != null) {
    return data[1];
  }
  return '';
}

export function getTextColor(useDarkMode: boolean | undefined) {
  return getColor(ColorType.textDefault, useDarkMode);
}

export const globalStyles = StyleSheet.create({
  rowContainerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
});
