import Meteor, { withTracker } from '@meteorrn/core';
import React from 'react';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  GluestackUIProvider,
  Badge,
  BadgeText,
  Box,
  Icon,
  SearchIcon,
  VStack,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import Constants from 'expo-constants';
const { expoConfig } = Constants;
import { MessagesSquare, Library, SettingsIcon } from 'lucide-react-native';

import DiscoverContainer from './src/Screens/Discover';
import RequestsContainer from './src/Screens/Requests';
import AuthContainer from './src/Screens/Auth/AuthContainer';
import ProfileContainer from './src/Screens/Profile';
import { StateContext } from './src/StateContext';
import ProfileEdit from './src/Screens/ProfileEdit';

const localDevApi = `ws://${expoConfig?.hostUri?.split(':').shift()}:3000/websocket`;
const productionApi = 'wss://app.librella.co/websocket';
const api = __DEV__ ? localDevApi : productionApi;

Meteor.connect(api, { AsyncStorage });

const Tab = createBottomTabNavigator();

function App({ currentUser }) {
  if (!currentUser) {
    return (
      <GluestackUIProvider config={config}>
        <AuthContainer />
      </GluestackUIProvider>
    );
  }

  let notificationCount = 0;
  currentUser.notifications?.forEach((item) => (notificationCount += item.count));

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
                  <NotificationBadge count={notificationCount}>
                    <Icon as={MessagesSquare} color={color} size="xl" />
                  </NotificationBadge>
                ),
                tabBarLabel: 'Requests',
              })}
            />
            <Tab.Screen
              component={ProfileContainer}
              name="My Profile"
              options={(route) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Icon as={Library} color={color} size="xl" />,
              })}
            />
            <Tab.Screen
              component={ProfileEdit}
              name="Settings"
              options={(route) => ({
                tabBarIcon: ({ color, size }) => <Icon as={SettingsIcon} color={color} size="xl" />,
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </StateContext.Provider>
  );
}

function NotificationBadge({ count, children }) {
  if (count === 0) {
    return children;
  }

  return (
    <Box>
      <VStack>
        <Badge
          h={20}
          w={20}
          bg="$red500"
          borderRadius="$full"
          mb={-14}
          mr={-14}
          size="sm"
          zIndex={1}
          variant="solid"
          alignSelf="flex-end"
        >
          <BadgeText color="$white">{count}</BadgeText>
        </Badge>
        {children}
      </VStack>
    </Box>
  );
}

let AppContainer = withTracker(() => {
  Meteor.subscribe('me');
  const user = Meteor.user();
  const currentUser = {
    ...user,
    createdAt: user?.createdAt,
  };

  return {
    currentUser,
  };
})(App);

export default AppContainer;
