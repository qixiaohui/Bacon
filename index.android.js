'use strict'
import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './app/page/home_screen';
import FlightScreen from './app/page/flight_screen';

const Bacon = StackNavigator({
  Home: { screen: HomeScreen },
  Flight: {screen: FlightScreen}
});

AppRegistry.registerComponent('Bacon', () => Bacon);