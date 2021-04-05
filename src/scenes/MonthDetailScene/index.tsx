import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Linking, Dimensions, Switch} from 'react-native';
import Svg from 'react-native-svg';
import {VictoryLegend, VictoryPie} from 'victory-native';
import {
  GraphFormat,
  LegendFormat,
  sliceColors,
  Transaction,
} from '../../types/types';
import {styles} from '../HomeScene/styles';

interface MonthDetailProps {
  month: string;
  elementsToDisplay: Transaction[];
  totalSpend: string;
  year: number;
}

interface MonthDetailState {
  showLabels: boolean;
  showDarkModeStyle: boolean;
}

export default class MonthDetailScene extends Component<
  MonthDetailProps,
  MonthDetailState
> {
  readonly state: MonthDetailState = {
    showLabels: false,
    showDarkModeStyle: false,
  };

  private checkColorBrightness(color: string): string {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 50) {
      return 'lightgray';
    }
    return 'black';
  }

  getGraphData(): GraphFormat[] {
    let graphDat: GraphFormat[] = [];

    if (!this.props.elementsToDisplay) {
      return [];
    }

    this.props.elementsToDisplay?.forEach((el) => {
      if (graphDat.find((e) => e.x == el.tag)) {
        const index = graphDat.findIndex((ind) => ind.x == el.tag);
        const data = graphDat.find((da) => da.x == el.tag);

        graphDat[index].y = Math.round(data.y + el.amount);
      } else {
        graphDat.push({x: el.tag, y: el.amount});
      }
    });

    return graphDat;
  }

  getLegendData(): LegendFormat[] {
    let stringDat: LegendFormat[] = [];

    this.props.elementsToDisplay.forEach((el) => {
      if (!stringDat.find((e) => e.name == el.tag)) {
        stringDat.push({name: el.tag});
      }
    });

    return stringDat;
  }

  componentDidMount() {
    // @ts-ignore */}
    this.props.navigation.setParams({
      title: `Details ${this.props.month} ${this.props.year}`,
    });

    AsyncStorage.getItem('showDarkmodeStyle').then((value) => {
      if (value) {
        this.setState({showDarkModeStyle: value === 'true'});
      }
    });
  }

  render() {
    const {width, height} = Dimensions.get('window');
    return (
      <View
        style={{
          backgroundColor: '#cccccc32',
          flex: 1,
          paddingHorizontal: 10,
        }}>
        <View style={{flex: 1.5, paddingHorizontal: 10}}>
          <Text
            style={[
              styles.textHeading,
              {
                color: this.state.showDarkModeStyle ? 'white' : 'black',
              },
            ]}>
            Ausgaben Gesamt: {this.props.totalSpend}€
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: this.state.showDarkModeStyle ? 'white' : 'black',
                marginBottom: 10,
              }}>
              Beträge und Texte ausblenden
            </Text>
            <Switch
              value={this.state.showLabels}
              onValueChange={(value) => this.setState({showLabels: value})}
            />
          </View>
        </View>
        <View style={{flex: 7}}>
          <Svg>
            <VictoryPie
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: (props) => {
                            return !!props.text
                              ? {text: ''}
                              : {
                                  text: `${props?.slice?.data?.xName}\n${Number(
                                    props.slice?.data?.y,
                                  ).toFixed(2)}€`,
                                  style: {
                                    fill: this.checkColorBrightness(
                                      sliceColors[props.index],
                                    ),
                                    fontSize: 20,
                                    fontWeight: 600,
                                  },
                                };
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
              animate={{easing: 'exp'}}
              data={this.getGraphData()}
              width={width * 0.9}
              padding={10}
              innerRadius={width * 0.15}
              labelRadius={width * 0.2}
              padAngle={1}
              labels={(props) =>
                this.state.showLabels
                  ? null
                  : `${props?.slice?.data?.xName}\n${Number(
                      props.slice?.data?.y,
                    ).toFixed(2)}€`
              }
              colorScale={sliceColors}
              cornerRadius={10}
              style={{labels: {fontSize: 20, fill: 'black', fontWeight: 600}}}
              standalone={false}
            />
          </Svg>
        </View>
        <View style={{flex: 3}}>
          <VictoryLegend
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: 'data',
                        mutation: (props) => {
                          console.log('pressed:', props);
                          const fill = props.style && props.style.fill;
                          return fill === '#c43a31'
                            ? null
                            : {style: {fill: '#c43a31'}};
                        },
                      },
                      {
                        target: 'labels',
                        mutation: (props) => {
                          return props.text === 'clicked'
                            ? null
                            : {text: 'clicked'};
                        },
                      },
                    ];
                  },
                },
              },
            ]}
            colorScale={sliceColors}
            data={this.getLegendData()}
            style={{
              labels: {
                fontSize: 16,
                fill: this.state.showDarkModeStyle ? 'white' : 'black',
              },
            }}
            orientation="horizontal"
            itemsPerRow={3}
            gutter={40}
            borderPadding={{bottom: 0, left: 10, right: 5}}
            width={width}
            symbolSpacer={15}
          />
        </View>

        {/* <View style={{flex: 1}} /> */}
      </View>
    );
  }
}
