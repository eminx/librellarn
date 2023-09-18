import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Requests from "./Requests";
import Request from "./Request";

const Stack = createNativeStackNavigator();

export default function RequestsContainer({}) {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen name="Messages" component={Requests} />
      <Stack.Screen
        name="Request"
        component={Request}
        options={({ route }) => ({
          title: route.params.request?.bookTitle + " | " + route.params.name,
          tabBarButton: (props) => null,
          tabBarVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
