import * as React from 'react';
import {Component} from 'react';
import {View, Text, Linking, Dimensions, Switch} from 'react-native';
import {Slider} from 'react-native-elements';
import Svg from 'react-native-svg';
import {VictoryContainer, VictoryLabel, VictoryPie} from 'victory-native';
import {GraphFormat, sliceColors, Transaction} from '../../types/types';
import {styles} from '../HomeScene/styles';

interface MonthDetailProps {
  month: string;
  elementsToDisplay: Transaction[];
  totalSpend: string;
  year: number;
}

interface MonthDetailState {
  showLabels: boolean;
}

export default class MonthDetailScene extends Component<
  MonthDetailProps,
  MonthDetailState
> {
  readonly state: MonthDetailState = {
    showLabels: false,
  };

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

  componentDidMount() {
    // @ts-ignore */}
    this.props.navigation.setParams({
      title: `Details ${this.props.month} ${this.props.year}`,
    });
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <View
        style={{backgroundColor: '#cccccc32', flex: 1, paddingHorizontal: 10}}>
        <Text style={[styles.textHeading, {textAlign: 'center'}]}>
          Ausgaben Gesamt: {this.props.totalSpend}€
        </Text>
        <View style={{flex: 3}}>
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
        <View style={{flex: 1}}>
          <Text>Show Labels?</Text>
          <Switch
            value={this.state.showLabels}
            onValueChange={(value) => this.setState({showLabels: value})}
          />
        </View>
      </View>
    );
  }
}
