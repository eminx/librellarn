import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Discover from './Discover';
import Book from './Book';
import User from './User';

const Stack = createNativeStackNavigator();

export default function DiscoverContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Discover">
      <Stack.Screen name="Discover" component={Discover} />
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
