import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {Component} from 'react';
import {View, Text, Dimensions, Switch} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Svg from 'react-native-svg';
import {VictoryLegend, VictoryPie} from 'victory-native';
import {
  GraphFormat,
  LegendFormat,
  sliceColors,
  STORE_DARKMODE,
  Transaction,
} from '../../types/types';
import {styles} from '../HomeScene/styles';

type MonthDetails = {
  month: string;
  elementsToDisplay: Transaction[];
  totalSpend: string;
  year: number;
};

type RouteParams = {
  params: MonthDetails;
};

interface MonthDetailProps {
  navigation: any;
  route: RouteParams;
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

    if (luma < 90) {
      return 'lightgray';
    }
    return 'black';
  }

  getGraphData(): GraphFormat[] {
    let graphDat: GraphFormat[] = [];

    const {elementsToDisplay} = this.props.route?.params;

    if (!elementsToDisplay) {
      return [];
    }

    elementsToDisplay?.forEach(el => {
      if (graphDat.find(e => e.x == el.tag)) {
        const index = graphDat.findIndex(ind => ind.x == el.tag);
        const data = graphDat.find(da => da.x == el.tag);

        if (data != null) {
          graphDat[index].y = Math.round(data.y + el.amount);
        }
      } else {
        graphDat.push({x: el.tag, y: el.amount});
      }
    });

    return graphDat;
  }

  getLegendData(): LegendFormat[] {
    let stringDat: LegendFormat[] = [];
    const {elementsToDisplay} = this.props.route?.params;

    if (!elementsToDisplay) {
      return stringDat;
    }

    elementsToDisplay.forEach(el => {
      if (!stringDat.find(e => e.name == el.tag)) {
        stringDat.push({name: el.tag});
      }
    });

    return stringDat;
  }

  componentDidMount() {
    const {year, month} = this.props.route.params;
    if (!!year && !!month) {
      this.props.navigation.setOptions({
        title: `Details ${month} ${year}`,
      });
    }

    AsyncStorage.getItem(STORE_DARKMODE).then(value => {
      if (value) {
        this.setState({showDarkModeStyle: value === 'true'});
      }
    });
  }

  render() {
    const {width, height} = Dimensions.get('window');
    const {totalSpend} = this.props.route?.params;
    return (
      <ScrollView
        style={{
          backgroundColor: '#cccccc32',
          flex: 1,
          paddingHorizontal: 10,
        }}>
        <View style={{flex: 2, paddingHorizontal: 10, marginBottom: 10}}>
          <Text
            style={[
              styles.textHeading,
              {
                color: this.state.showDarkModeStyle ? 'white' : 'black',
              },
            ]}>
            Ausgaben Gesamt: {totalSpend ?? 0}€
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
              onValueChange={value => this.setState({showLabels: value})}
            />
          </View>
        </View>

        <Svg style={{flex: 1}} height={width}>
          <VictoryPie
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: 'labels',
                        mutation: props => {
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
                                  textShadowColor: 'black',
                                  textShadowOffset: 2,
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
            labels={props =>
              this.state.showLabels
                ? `${props?.slice?.data?.xName}\n${Number(
                    props.slice?.data?.y,
                  ).toFixed(2)}€`
                : null
            }
            colorScale={sliceColors}
            cornerRadius={10}
            style={{labels: {fontSize: 20, fill: 'black', fontWeight: 600}}}
            standalone={false}
          />
        </Svg>

        <View style={{flex: 1, marginTop: 30}}>
          <VictoryLegend
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: 'data',
                        mutation: props => {
                          console.log('pressed:', props);
                          const fill = props.style && props.style.fill;
                          return fill === '#c43a31'
                            ? null
                            : {style: {fill: '#c43a31'}};
                        },
                      },
                      {
                        target: 'labels',
                        mutation: props => {
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
            itemsPerRow={2}
            gutter={40}
            height={height * 0.45}
            borderPadding={{bottom: 0, left: 10, right: 5}}
            width={width}
            symbolSpacer={15}
          />
        </View>

        {/* <View style={{flex: 1}} /> */}
      </ScrollView>
    );
  }
}
