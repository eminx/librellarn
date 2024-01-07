import Meteor, { useTracker } from '@meteorrn/core';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GluestackUIProvider, Icon, SearchIcon } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import Constants from 'expo-constants';
const { expoConfig } = Constants;
import { MessagesSquare, PlusSquare, Library } from 'lucide-react-native';

import DiscoverContainer from './src/Screens/DiscoverContainer';
import AddBookContainer from './src/Screens/AddBookContainer';
import RequestsContainer from './src/Screens/RequestsContainer';
import AuthContainer from './src/Screens/AuthContainer';
import ProfileContainer from './src/Screens/ProfileContainer';
import { StateContext } from './src/StateContext';

const uri = `ws://${expoConfig?.hostUri?.split(':').shift()}:3000`;
Meteor.connect(`${uri}/websocket`, { AsyncStorage });

// Meteor.connect('wss://librella.app/websocket', { AsyncStorage });

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
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => ({
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
              }),
            })}
          >
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
              component={RequestsContainer}
              name="RequestsContainer"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Icon as={MessagesSquare} color={color} size="xl" />
                ),
                tabBarLabel: 'Requests',
              })}
            />
            <Tab.Screen
              component={ProfileContainer}
              name="MyShelf"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Icon as={Library} color={color} size="xl" />,
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </StateContext.Provider>
  );
}
