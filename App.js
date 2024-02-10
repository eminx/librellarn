import Meteor, { withTracker } from '@meteorrn/core';
import React from 'react';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  GluestackUIProvider,
  Badge,
  BadgeText,
  Icon,
  SearchIcon,
  VStack,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
// import Constants from 'expo-constants';
import { MessagesSquare, Library, SettingsIcon } from 'lucide-react-native';
// import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';

// import './i18n';
import DiscoverContainer from './src/Screens/Discover';
import RequestsContainer from './src/Screens/Requests';
import AuthContainer from './src/Screens/Auth/AuthContainer';
import ProfileContainer from './src/Screens/Profile';
import { StateContext } from './src/StateContext';
import ProfileEdit from './src/Screens/ProfileEdit';
import { i18n } from './i18n';

const localDevApi = 'ws://localhost:3000/websocket';
const productionApi = 'wss://librella.app/websocket';
// const api = __DEV__ ? localDevApi : productionApi;
const api = productionApi;

try {
  Meteor.connect(api, { AsyncStorage });
} catch (err) {
  sendErr(err);
}

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
  currentUser?.notifications?.forEach((item) => {
    if (Number.isInteger(item.count)) {
      return (notificationCount += item.count);
    }
  });

  return (
    <>
      <StatusBar style="auto" />
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
                  tabBarLabel: i18n.t('discover.label'),
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
                  tabBarLabel: i18n.t('requests.label'),
                })}
              />
              <Tab.Screen
                component={ProfileContainer}
                name="My Profile"
                options={(route) => ({
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => <Icon as={Library} color={color} size="xl" />,
                  tabBarLabel: i18n.t('profile.label'),
                })}
              />
              <Tab.Screen
                component={ProfileEdit}
                name="Settings"
                options={(route) => ({
                  tabBarIcon: ({ color, size }) => (
                    <Icon as={SettingsIcon} color={color} size="xl" />
                  ),
                  tabBarLabel: i18n.t('settings.label'),
                })}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </GluestackUIProvider>
      </StateContext.Provider>
    </>
  );
}

function NotificationBadge({ count, children }) {
  if (count === 0) {
    return children;
  }

  return (
    <VStack>
      <Badge
        alignSelf="flex-end"
        bg="$red500"
        borderRadius="$full"
        h={20}
        mb={-14}
        mr={-14}
        size="sm"
        variant="solid"
        w={20}
        zIndex={1}
      >
        <BadgeText color="$white">{count}</BadgeText>
      </Badge>
      {children}
    </VStack>
  );
}

let AppContainer = withTracker(() => {
  Meteor.subscribe('me');
  const user = Meteor.user();
  const currentUser = user && {
    ...user,
    createdAt: user?.createdAt?.toString(),
  };

  return {
    currentUser,
  };
})(App);

ErrorUtils.setGlobalHandler((error, isFatal) => {
  error.isFatal = isFatal;
  sendErr(error);
});

export default AppContainer;
