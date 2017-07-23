'use strict'
import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './app/page/home_screen';

const Bacon = StackNavigator({
  Home: { screen: HomeScreen },
});

AppRegistry.registerComponent('Bacon', () => Bacon);