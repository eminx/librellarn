import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddBookSearch from './Profile/AddBookSearch';
import AddBookItem from './Profile/AddBookItem';
import AddBookManually from './Profile/AddBookManually';

const Stack = createNativeStackNavigator();

export default function AddBookContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Book Search">
      <Stack.Screen name="Book Search" component={AddBookSearch} />
      <Stack.Screen
        name="Book to Add"
        component={AddBookItem}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen name="Add Book Manually" component={AddBookManually} />
    </Stack.Navigator>
  );
}
