import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Discover from './Discover';
import Book from './Book';

const Stack = createNativeStackNavigator();

export default function DiscoverContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Discover">
      <Stack.Screen name="Discover" component={Discover} />
      <Stack.Screen
        name="Book"
        component={Book}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
