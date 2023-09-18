import Meteor, { useTracker } from '@meteorrn/core';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AddIcon,
  AtSignIcon,
  GluestackUIProvider,
  Icon,
  MessageCircleIcon,
  SearchIcon,
} from '@gluestack-ui/themed';
import Constants from 'expo-constants';
import { config } from './gluestack-ui.config';
const { expoConfig } = Constants;

import DiscoverContainer from './src/Screens/DiscoverContainer';
import AddBookContainer from './src/Screens/AddBookContainer';
import RequestsContainer from './src/Screens/RequestsContainer';
import AuthContainer from './src/Screens/AuthContainer';
import ProfileContainer from './src/Screens/ProfileContainer';
import { StateContext } from './src/StateContext';

const uri = `ws://${expoConfig?.hostUri?.split(':').shift()}:3000`;

Meteor.connect(`${uri}/websocket`, { AsyncStorage });

const Tab = createBottomTabNavigator();

export default function App() {
  Meteor.subscribe('me');
  const currentUser = useTracker(() => Meteor.user(), []);

  if (!currentUser) {
    return (
      <GluestackUIProvider config={config}>
        <AuthContainer />
      </GluestackUIProvider>
    );
  }

  return (
    <StateContext.Provider value={{ currentUser }}>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              component={DiscoverContainer}
              name="DiscoverContainer"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Icon as={SearchIcon} color={color} size="xl" />,
                tabBarLabel: 'Discover',
              })}
            />
            <Tab.Screen
              component={AddBookContainer}
              name="Add Book"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Icon as={AddIcon} color={color} size="xl" />,
              })}
            />
            <Tab.Screen
              component={RequestsContainer}
              name="Requests"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon as={MessageCircleIcon} color={color} size="xl" />
                ),
              })}
            />
            <Tab.Screen
              component={ProfileContainer}
              name="Profile"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Icon as={AtSignIcon} color={color} size="xl" />,
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </StateContext.Provider>
  );
}
