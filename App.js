import Meteor, { withTracker } from '@meteorrn/core';
import React, { useEffect, useState } from 'react';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  GluestackUIProvider,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  Icon,
  SearchIcon,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
// import Constants from 'expo-constants';
import { MessagesSquare, Library, SettingsIcon } from 'lucide-react-native';
// import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { getLocales } from 'expo-localization';

import DiscoverContainer from './src/Screens/Discover';
import RequestsContainer from './src/Screens/Requests';
import AuthContainer from './src/Screens/Auth/AuthContainer';
import ProfileContainer from './src/Screens/Profile';
import { StateContext } from './src/StateContext';
import ProfileEdit from './src/Screens/ProfileEdit';
import ConfirmDialog from './src/Components/ConfirmDialog';
import { i18n } from './i18n';
import { call } from './src/utils/functions';
import { registerForPushNotificationsAsync } from './src/NotificationsManager';

const localDevApi = 'ws://localhost:3000/websocket';
const productionApi = 'wss://librella.app/websocket';
// const api = __DEV__ ? localDevApi : productionApi;
const api = productionApi;

try {
  Meteor.connect(api, { AsyncStorage });
} catch (error) {
  console.log(error);
}

const Tab = createBottomTabNavigator();

function App({ currentUser }) {
  const [state, setState] = useState({
    confirmLocationButtonLoading: false,
    currentLocale: i18n?.defaultLocale,
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
    const deviceLang = getLocales()[0].languageCode;
    changeLanguage(deviceLang);
  }, []);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setTimeout(() => {
      setState({ ...state, currentLocale: lang });
    }, 500);
  };

  const { confirmLocationButtonLoading } = state;

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

  const setLocation = async () => {
    setState({
      ...state,
      confirmLocationButtonLoading: true,
    });
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await call('updateProfile', { location });
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('settings.locationUpdated')} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        confirmLocationButtonLoading: false,
      });
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <StateContext.Provider value={{ currentUser, changeLanguage }}>
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
                  headerTitle: i18n.t('settings.label'),
                  tabBarLabel: i18n.t('settings.label'),
                })}
              />
            </Tab.Navigator>
          </NavigationContainer>
          <ConfirmDialog
            isOpen={currentUser && !currentUser.location}
            header={i18n.t('settings.location')}
            hideFooter
          >
            <Box bg="$white" p="$4">
              <Text mb="$4">{i18n.t('settings.locationNotice')}</Text>
              <Text mb="$4">{i18n.t('settings.locationNotice2')}</Text>
              <Text mb="$4" textAlign="center">
                {i18n.t('settings.locationPrivacy')}
              </Text>
              <Button
                isDisabled={confirmLocationButtonLoading}
                mb="$2"
                onPress={() => setLocation()}
              >
                {confirmLocationButtonLoading && <ButtonSpinner mr="$1" />}
                <ButtonText>{i18n.t('settings.saveLocation')}</ButtonText>
              </Button>
              {confirmLocationButtonLoading && (
                <Text textAlign="center">{i18n.t('settings.locationLoading')}</Text>
              )}
            </Box>
          </ConfirmDialog>
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
  console.log(error);
});

export default AppContainer;
