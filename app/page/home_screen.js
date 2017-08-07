
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  H4,
  Spinner,
  Input,
  P,
  B,
  RadioGroup,
  Button,
  Bubble,
  Switcher,
  SegmentedControlButton
} from 'nachos-ui';
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';
import Toast from 'react-native-simple-toast';
const Dimensions = require('Dimensions');
import Slider from 'react-native-slider';
const axios = require('axios');
const _ = require('underscore');

const CITY_URL = 'http://45.55.0.151:8000/api/city';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Cheap Flight',
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      cities: [],
      canada: '',
      dateFormatMatch: 'normal',
      date: '',
      passengers: 1,
      trip: 'oneway',
      stateFrom: '',
      cityFrom: '',
      stateTo: '',
      cityTo: '',
      tab: 'search'
    };
  };

  componentDidMount() {
    axios({
      method: 'get',
      url: CITY_URL
    }).then((response) => {
      this.state.cities = response.data;
      this.state.loaded = true;
      this.forceUpdate();
    }).catch((error) => {
      console.error(error.message);
    });
  };

  checkDate(date) {
    this.state.date = date;
    var dateCheck = date.match(/^\d{2}\/\d{2}\/\d{4}$/)
    this.state.dateFormatMatch = dateCheck? 'valid' : 'error';
    this.forceUpdate();
  }

  handleSliderChange(value) {
        console.log(value);
    this.state.passengers = parseInt(value);
    this.forceUpdate();
  }

  setStateFrom(state) {
    this.state.stateFrom = state;
    this.forceUpdate();
  };

  setCityFrom(city) {
    if (this.state.stateFrom == "") {
      return;
    }
    this.state.cityFrom = city;
    this.forceUpdate();
  }

  getStateFromOptionList() {
    return this.refs['STATE_LIST_FROM'];
  }

  getCityFromOptionList() {
    return this.refs['CITY_LIST_FROM'];
  }

  setStateTo(state) {
    this.state.stateTo = state;
    this.forceUpdate();
  };

  setCityTo(city) {
    if (this.state.stateTo == "") {
      return;
    }
    this.state.cityTo = city;
    this.forceUpdate();
  }

  getStateToOptionList() {
    return this.refs['STATE_LIST_TO'];
  }

  getCityToOptionList() {
    return this.refs['CITY_LIST_TO'];
  }

  submit() {
    this.props.navigation.navigate('Flight', {
      trip: this.state.trip, 
      from: `${this.state.cityFrom}, ${this.state.stateFrom}`,
      to: `${this.state.cityTo}, ${this.state.stateTo}`,
      departure: this.state.date,
      passenger: this.state.passengers
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <Switcher
            style={styles.switcher}
            onChange={tab => this.setState({ tab })}
            defaultSelected={this.state.tab}
          >
            <SegmentedControlButton
              value='search'
              text='search'
              iconName='md-search'
            />
            <SegmentedControlButton
             value='history' 
             text='history' 
             iconName='md-folder-open' />
          </Switcher>
          {this.state.tab === 'search'?
          <View style={styles.innerContainer}>
          <H4 style={styles.subtext}>Select the departure state</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getStateFromOptionList.bind(this)}
              ref="SELECT_STATE_FROM"
              defaultValue="Select a State"
              onSelect={this.setStateFrom.bind(this)}>
              {
                _.map(this.state.cities, (cities, state) => {
                  return (<Option>{state}</Option>);
                })
              }
            </Select>
          </View>
          <H4 style={styles.subtext}>Select the departure city</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getCityFromOptionList.bind(this)}
              ref="SELECT_CITY_FROM"
              defaultValue="Select a City"
              onSelect={this.setCityFrom.bind(this)}>
              {
                this.state.stateFrom == ""? 
                  _.map(this.state.cities["California"], (city) => {
                    return (<Option>{city}</Option>);
                  })
                  :
                  _.map(this.state.cities[this.state.stateFrom], (city) => {
                    return (<Option>{city}</Option>);
                  })
              }
            </Select>
          </View>
          <H4 style={styles.subtext}>Select the arrival state</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getStateToOptionList.bind(this)}
              ref="SELECT_STATE_TO"
              defaultValue="Select a State"
              onSelect={this.setStateTo.bind(this)}>
              {
                _.map(this.state.cities, (cities, state) => {
                  return (<Option>{state}</Option>);
                })
              }
            </Select>
          </View>
          <H4 style={styles.subtext}>Select the arrival city</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getCityToOptionList.bind(this)}
              ref="SELECT_CITY_TO"
              defaultValue="Select a City"
              onSelect={this.setCityTo.bind(this)}>
              {
                this.state.state == ""? 
                  _.map(this.state.cities["California"], (city) => {
                    return (<Option>{city}</Option>);
                  })
                  :
                  _.map(this.state.cities[this.state.stateTo], (city) => {
                    return (<Option>{city}</Option>);
                  })
              }
            </Select>
          </View>
          <H4 style={styles.subtext}>Leaving date</H4>
          <View style={styles.input}>
            <Input
              status={this.state.dateFormatMatch}
              width={Dimensions.get('window').width-30}
              height={40}
              placeholder='MM/DD/YYYY'
              value={this.state.date}
              onChangeText={this.checkDate.bind(this)}
            />
          </View>
          <H4 style={styles.subtext}>Passengers</H4>
          <View style={styles.input}>
            <B>
            {this.state.passengers}
            </B>
            <Slider
              width={Dimensions.get('window').width-40}
              minimumValue={1}
              maximumValue={5}
              value={this.state.passengers}
              onValueChange={this.handleSliderChange.bind(this)} />
          </View>
          <View style={styles.radio}>
            <RadioGroup
              onChange={value => this.setState({ value })}
              defaultSelected='One way'
              options={['One way', 'Round trip']}
            />
          </View>
          <View style={styles.confirm}>
            <Button kind='squared' onPress={this.submit.bind(this)}>
              Confirm
            </Button>
          </View>
          <OptionList ref="STATE_LIST_FROM"/>
          <OptionList ref="CITY_LIST_FROM"/>
          <OptionList ref="STATE_LIST_TO"/>
          <OptionList ref="CITY_LIST_TO"/>
          </View>:
          <View><Spinner/></View>
          }
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Spinner />
          </View>
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  innerContainer: {
    flex: 1
  },
  switcher: {
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 5,
    marginTop: 5,
  },
  subtext: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  select: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radio: {
    marginLeft: 15,
    marginTop: 15,
  },
  confirm: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginTop: 50,
    width: Dimensions.get('window').width,
  },
  thumb: {
    width: 30,
    height: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  }
});

module.exports = HomeScreen;