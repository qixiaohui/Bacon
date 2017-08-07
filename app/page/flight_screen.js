import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
} from 'react-native';
import {
  H4,
  H5,
  Spinner,
  Strong,
  Em,
  B,
} from 'nachos-ui';
import SVGImage from 'react-native-svg-image';
const axios = require('axios');
//const url = 'http://45.55.0.151:8000/api/flights/';
// local testing url
const url = 'http://127.0.0.1:5000/api/flights/';
class FlightScreen extends React.Component {
  static navigationOptions = {
    title: 'Flights'
  };

  constructor(props) {
  	super(props);
  	this.state = {
  		trip: this.props.navigation.state.params.trip,
  		from: this.props.navigation.state.params.from,
  		to: this.props.navigation.state.params.to,
  		departure: this.props.navigation.state.params.departure.replace(/\//g, '.'),
  		passenger: this.props.navigation.state.params.passenger,
  		flights: false,
  		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,        
		}),
  	};
  }

  componentDidMount() {
  	axios({
  		method: 'get',
  		url: `${url}${this.state.trip}/${this.state.from}/${this.state.to}/${this.state.departure}/${this.state.passenger}`
  	}).then((response) => {
  		this.state.flights = true;
  		this.setState({
  			dataSource: this.state.dataSource.cloneWithRows(response.data)
  		});
  	}).catch((error) => {
  		console.error(error.message);
  	});
  }

  renderRow(data) {
  	return (
  		<View style={styles.rowContent}>
        <View style={styles.infoContainer}>
          <Strong>{data.timings[0].departure_time} - {data.timings[0].arrival_time}</Strong>
          <Strong>{data["flight duration"]}</Strong>
          <Strong>{data.departure} - {data.arrival}</Strong>
    			<Em><B>{data["ticket price"]}$</B></Em>
        </View>
        <View style={styles.logoContainer}>
          <SVGImage style={styles.logo} source={{uri: data.logo}} />
        </View>
  		</View>
	);
  }

  render() {
  	if (this.state.flights) {
  		return (
  		<View style={styles.container}>
	      <ListView
          renderSeparator={(sectionID, rowID) =>
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
	        dataSource={this.state.dataSource}
	        renderRow={this.renderRow.bind(this)}
	      />
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
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginLeft:25,
    backgroundColor: 'grey',
  },
  rowContent: {
    marginLeft:15,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 15,
    flex: 1,
    flexDirection: "row"
  },
  infoContainer: {
    flex: 0.8,
  },
  logoContainer: {
    flex: 0.25,
    justifyContent: "flex-end",
  },
  logo: {
    alignSelf: "flex-end",
    marginRight: 15,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    width: 50,
    height: 50
  }
});

module.exports = FlightScreen;