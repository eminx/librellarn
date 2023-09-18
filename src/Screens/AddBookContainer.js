import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddBookSearch from "./AddBookSearch";
import AddBookItem from "./AddBookItem";
import AddBookManually from "./AddBookManually";

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
