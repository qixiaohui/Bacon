
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
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
      state: '',
      city: ''
    };
  };

  componentDidMount() {
    axios({
      method: 'get',
      url: CITY_URL
    }).then((response) => {
      console.log(response);
      console.log(this.state);
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

  setState(state) {
    this.state.state = state;
    this.forceUpdate();
  };

  setCity(city) {
    if (this.state.state == "") {
      this.refs['SELECT_CITY'].blur();
      return;
    }
    this.state.city = city;
    this.forceUpdate();
  }

  getStateOptionList() {
    return this.refs['STATE_LIST'];
  }

  getCityOptionList() {
    return this.refs['CITY_LIST'];
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <H4 style={styles.subtext}>Select the state</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getStateOptionList.bind(this)}
              ref="SELECT_STATE"
              defaultValue="Select a State"
              onSelect={this.setState.bind(this)}>
              {
                _.map(this.state.cities, (cities, state) => {
                  return (<Option>{state}</Option>);
                })
              }
            </Select>
          </View>
          <H4 style={styles.subtext}>Select the city</H4>
          <View style={styles.select}>
            <Select
              height={40}
              width={Dimensions.get('window').width-30}
              optionListRef={this.getCityOptionList.bind(this)}
              ref="SELECT_CITY"
              defaultValue="Select a City"
              onSelect={this.setCity.bind(this)}>
              {
                this.state.state == ""? 
                  _.map(this.state.cities["California"], (city) => {
                    return (<Option>{city}</Option>);
                  })
                  :
                  _.map(this.state.cities[this.state.state], (city) => {
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
            <Button kind='squared' >
              Confirm
            </Button>
          </View>
          <OptionList ref="STATE_LIST"/>
          <OptionList ref="CITY_LIST"/>
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
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom:0,
    left:0,
  }
});

module.exports = HomeScreen;