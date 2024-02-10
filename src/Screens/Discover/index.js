import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Discover from './Discover';
import Book from './Book';
import User from './User';
import { i18n } from '../../../i18n';

const Stack = createNativeStackNavigator();

export default function DiscoverContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Discover">
      <Stack.Screen
        name="Discover"
        component={Discover}
        options={{ title: i18n.t('discover.label') }}
      />
      <Stack.Screen
        name="DiscoverBook"
        component={Book}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="DiscoverUser"
        component={User}
        options={({ route }) => ({ title: route.params.username })}
      />
    </Stack.Navigator>
  );
}
